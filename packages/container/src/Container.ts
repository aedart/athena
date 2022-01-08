import ContainerContract, {
    BindingIdentifier,
    FactoryCallback,
    Resolved,
    Binding
} from "@aedart/contracts/dist/container";
import { DependenciesReflector as DependenciesReflectorContract  } from "@aedart/contracts/dist/reflections";
import {DependenciesReflector, Reflector} from "@aedart/reflections";
import BindingResolutionException from "./exceptions/BindingResolutionException";
import BindingEntry from "./entries/Binding";
import { assertBindingIdentifier } from "./entries/assertions";
import {
    Reference as ReferenceContract,
    TargetMethodReference,
    Constructor,
} from "@aedart/contracts/dist/support";
import { Reference } from "@aedart/support";
import BindingException from "./exceptions/BindingException";

/**
 * Service Container
 *
 * @see ContainerContract
 */
export default class Container implements ContainerContract {

    /**
     * The current singleton container instance
     *
     * @protected
     *
     * @type {ContainerContract|null}
     */
    protected static instance: ContainerContract | null = null;

    /**
     * Map of bindings
     *
     * @protected
     */
    protected bindingsMap: Map<BindingIdentifier, Binding>;

    /**
     * Map of aliases
     *
     * @protected
     */
    protected aliasesMap: Map<BindingIdentifier, BindingIdentifier>;

    /**
     * Map of shared instances
     *
     * @protected
     */
    protected instancesMap: Map<BindingIdentifier, Resolved>;

    /**
     * Dependencies Reflector
     *
     * @protected
     */
    protected dependencyReflector?: DependenciesReflectorContract;

    /**
     * Container
     */
    constructor() {
        this.bindingsMap = new Map<BindingIdentifier, Binding>();
        this.aliasesMap = new Map<BindingIdentifier, BindingIdentifier>();
        this.instancesMap = new Map<BindingIdentifier, Resolved>();
    }

    /**
     * Get the singleton instance of the container
     *
     * @return {ContainerContract}
     */
    static getInstance(): ContainerContract {
        if (this.instance === null || this.instance === undefined) {
            // @ts-ignore
            return this.setInstance(new this());
        }

        return this.instance;
    }

    /**
     * Set the singleton instance of the container
     *
     * @param {ContainerContract|null} [container]
     *
     * @return {ContainerContract|null}
     */
    static setInstance(container: ContainerContract | null = null): ContainerContract | null {
        this.instance = container;

        // TODO: (Re)bind container instance, using the identifier... but is this needed?

        return this.instance;
    }

    /**
     * Flush and destroy the current container singleton instance
     */
    static destroy(): void {
        if (this.instance === null || this.instance === undefined) {
            return;
        }

        this.instance.flush();
        this.setInstance(null);
    }

    /**
     * Map of this container's bindings
     *
     * @return {Map<BindingIdentifier, Binding>}
     */
    get bindings(): Map<BindingIdentifier, Binding> {
        return this.bindingsMap;
    }

    /**
     * Map of binding aliases
     *
     * @return {Map<BindingIdentifier, BindingIdentifier>}
     */
    get aliases(): Map<BindingIdentifier, BindingIdentifier> {
        return this.aliasesMap;
    }

    /**
     * Map of shared instances (singletons)
     *
     * @return {Map<BindingIdentifier, Resolved>}
     */
    get instances(): Map<BindingIdentifier, Resolved> {
        return this.instancesMap;
    }

    /**
     * Register a binding using a callback
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|Constructor<any>} value
     * @param {boolean} [shared] Whether binding is shared (singleton) or not
     *
     * @return {ContainerContract}
     *
     * @throws {TypeError}
     */
    bind(abstract: BindingIdentifier, value: FactoryCallback | Constructor<any>, shared: boolean = false): ContainerContract {
        this.setBinding(abstract, value, shared);

        // @ts-ignore
        return this;
    }

    /**
     * Register a shared binding using a callback
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|Constructor<any>} value
     *
     * @return {ContainerContract}
     *
     * @throws {TypeError}
     */
    singleton(abstract: BindingIdentifier, value: FactoryCallback | Constructor<any>): ContainerContract {
        return this.bind(abstract, value, true);
    }

    /**
     * Register an existing instance as a shared binding
     *
     * @template T
     *
     * @param {BindingIdentifier} abstract
     * @param {Resolved<T>} instance
     *
     * @throws {TypeError}
     *
     * @return {Resolved}
     */
    instance<T = any>(abstract: BindingIdentifier, instance: Resolved<T>): Resolved<T> {
        this.assertBindingIdentifier(abstract);

        // Set (or overwrite) the instance
        this.instances.set(abstract, instance);

        return instance;
    }

    /**
     * Define an alias for the given binding identifier
     *
     * @param {BindingIdentifier} abstract
     * @param {BindingIdentifier} alias
     *
     * @return {ContainerContract}
     *
     * @throws {TypeError}
     */
    alias(abstract: BindingIdentifier, alias: BindingIdentifier): ContainerContract {
        this.assertBindingIdentifier(abstract);
        this.assertBindingIdentifier(alias);

        if (abstract === alias) {
            throw new TypeError('Unable to create binding alias to itself');
        }

        this.aliases.set(alias, abstract);

        // @ts-ignore
        return this;
    }

    /**
     * Determine if a binding exists for given identifier
     *
     * @param {BindingIdentifier} abstract
     *
     * @return {boolean}
     */
    has(abstract: BindingIdentifier): boolean {
        return this.bindings.has(abstract)
            || this.instances.has(abstract)
            || this.aliases.has(abstract);
    }

    /**
     * Alias for {@link has} method
     *
     * @param {BindingIdentifier} abstract
     *
     * @return {boolean}
     */
    bound(abstract: BindingIdentifier): boolean {
        return this.has(abstract);
    }

    /**
     * Find and resolve concrete instance that matches given identifier
     *
     * @template T
     *
     * @param {BindingIdentifier} abstract
     *
     * @return {Resolved<T>}
     *
     * @throws {BindingException} If unable to resolve binding
     */
    get<T = any>(abstract: BindingIdentifier): Resolved<T> {
        return this.make(abstract);
    }

    /**
     * Resolve binding
     *
     * @template T
     *
     * @param {BindingIdentifier} abstract
     * @param {...any} [params] Eventual parameters to be passed onto the binding
     *
     * @return {Resolved<T>}
     *
     * @throws {BindingException} If unable to resolve binding
     */
    make<T = any>(abstract: BindingIdentifier, ...params: any[]): Resolved<T> {
        // Resolve identifier, if an alias was given
        abstract = this.resolveAbstract(abstract);

        // Return singleton instance, if requested identifier matches a previously initiated instance
        if(this.instances.has(abstract)){
            return this.instances.get(abstract);
        }

        let binding: Binding | undefined = this.bindings.get(abstract);

        // When no binding is matched, but given abstract is a buildable class,
        // then build it. Otherwise fail...
        if (binding === undefined && this.isBuildable(abstract)) {
            return this.build(abstract as Constructor<any>, ...params);
        } else if (binding === undefined) {
            throw new BindingResolutionException('Unable to resolve abstract, no matching binding found and abstract is not buildable (not a class reference)');
        }

        // Build the binding and set instance, if binding entry is marked as "shared"
        let instance: Resolved<T> = this.build(binding, ...params);
        if (binding.shared) {
            this.instances.set(abstract, instance);
        }

        // Finally, return the resolved instance
        return instance;
    }

    /**
     * Attempt to resolve binding and return it's concrete instance or return
     * a default, if no concrete instance exists for given identifier.
     *
     * Note: The method might still fail, in case of the biding cannot be resolved.
     *
     * @template T, U
     *
     * @param {BindingIdentifier} abstract
     * @param {Resolved<U>|null} [defaultValue] Default instance to be returned if no binding exists for given identifier
     * @param {...any} [params] Eventual parameters to be passed onto the binding
     *
     * @return {Resolved<T> | Resolved<U> | null}
     *
     * @throws {BindingException} If unable to resolve binding
     */
    makeOrDefault<T = any, U = any>(abstract: BindingIdentifier, defaultValue: Resolved<U> | null = null, ...params: any[]): Resolved<T> | Resolved<U> | null {
        if (!this.has(abstract) && !this.isBuildable(abstract)) {
            return defaultValue;
        }

        return this.make(abstract, ...params);
    }

    /**
     * Builds a concrete instance from given binding or class constructor reference
     *
     * @template T
     *
     * @param {Constructor<any>|Binding} target
     * @param {...any} [params]
     *
     * @return {Resolved<T>}
     *
     * @throws {BindingResolutionException}
     */
    build<T = any>(target: Constructor<any> | Binding, ...params: any[]): Resolved<T> {
        // Abort when no target given
        if (!target) {
            throw new BindingResolutionException('Unable to build, no target binding or class reference given');
        }

        // When target is a binding and of the type factory callback, then resolve
        // it by invoking the callback with given parameters.
        if (this.isBinding(target) && (target as Binding).isFactoryCallback) {
            return this.resolveBindingCallback<T>((target as Binding), ...params);
        }

        // When target is a binding, then set the target to the binding's value,
        // so it can be resolved.
        if (this.isBinding(target)) {
            target = (target as Binding).value as Constructor<any>;
        }

        // Fail in case that target is not buildable (in case that target was not
        // a binding)
        if (!this.isBuildable(target)) {
            throw new BindingResolutionException('Target is not buildable (not a class reference or binding entry)');
        }

        // At this point, we are sure that the target is a class reference
        // and must be instantiated. But, we need to deal with eventual
        // dependencies. Therefore, when - and only when - no parameters
        // are provided, we must attempt to resolve eventual dependencies
        // by means of meta information, if it's available for the target.
        if (params.length === 0 && this.reflector.has(target)) {
            params = this.resolveDependencies(target as Constructor<any>);
        }

        // Finally, create a new instance with the given or resolved params
        return new (target as Constructor<any>)(...params);
    }

    /**
     * Call the given method or callback and inject its dependencies
     *
     * When no parameters are given, this method will attempt to resolve
     * target method or callback's dependencies automatically.
     *
     * @param {Function|TargetMethodReference|Reference} method Method or callback to be invoked
     * @param {...any} [params] Eventual parameters to be passed on to the target method
     *
     * @return {any}
     *
     * @throws {BindingException}
     */
    call(method: Function | TargetMethodReference | ReferenceContract, ...params: any[]): any {
        // Convert argument to a class method reference, if it's an array is given (target method reference)
        if (Array.isArray(method)) {
            method = Reference.fromArray(method);
        }

        // Invoke class method, if such has been given
        if (this.isClassMethodReference(method)) {
            return this.invokeClassMethod(method as ReferenceContract, ...params);
        }

        // Otherwise, we assume that a function, e.g. a callback, was given
        return this.invokeMethod(method as Function, undefined, ...params);
    }

    /**
     * Remove binding from this container
     *
     * @param {BindingIdentifier} abstract
     */
    forget(abstract: BindingIdentifier): void {
        this.bindings.delete(abstract);
        this.aliases.delete(abstract);
        this.instances.delete(abstract);
    }

    /**
     * Flush container of all its bindings and resolved instances
     */
    flush(): void {
        this.bindings.clear();
        this.aliases.clear();
        this.instances.clear();
    }

    /**
     * Set the dependency reflector this container must use
     *
     * @param {DependenciesReflectorContract} reflector
     */
    set reflector(reflector: DependenciesReflectorContract ) {
        this.dependencyReflector = reflector;

        // Force set the singleton instance of dependencies reflector,
        // to ensure that the correct instance is used throughout
        // the application...
        // @see "dependsOn" method implementation
        DependenciesReflector.setInstance(reflector);
    }

    /**
     * Get the dependency reflector this container uses
     *
     * @return {DependenciesReflectorContract}
     */
    get reflector(): DependenciesReflectorContract {
        if (!this.dependencyReflector) {
            this.reflector = this.makeDefaultReflector();
        }

        // @ts-ignore
        return this.dependencyReflector;
    }

    /*****************************************************************
     * Internals
     ****************************************************************/

    /**
     * Returns a default dependencies reflector
     *
     * @protected
     */
    protected makeDefaultReflector(): DependenciesReflectorContract {
        return DependenciesReflector.getInstance();
    }

    /**
     * Invokes the binding callback and returns the resulting concrete instance
     *
     * @template T
     *
     * @param {Binding} binding
     * @param {...any} [params]
     *
     * @return {Resolved<T>}
     *
     * @throws {BindingResolutionException}
     *
     * @protected
     */
    protected resolveBindingCallback<T = any>(binding: Binding, ...params: any[]): Resolved<T> {
        try {
            return (binding.value as FactoryCallback)(this, ...params);
        } catch (e) {
            throw new BindingResolutionException('Unable to resolve binding "' + this.identifierToString(binding.abstract) + '", due to: ' + (e as Error).message);
        }
    }

    /**
     * Determine if target is a buildable class
     *
     * @param {any} target
     *
     * @return {boolean}
     *
     * @protected
     */
    protected isBuildable(target: any): boolean {
        return Reflector.isClass(target);
    }

    /**
     * Determine if target is callable
     *
     * @param {any} target
     *
     * @return {boolean}
     *
     * @protected
     */
    protected isCallable(target: any): boolean {
        return Reflector.isCallable(target);
    }

    /**
     * Set a binding in this container
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|Constructor<any>} concrete
     * @param {boolean} [shared]
     *
     * @protected
     */
    protected setBinding(
        abstract: BindingIdentifier,
        concrete: FactoryCallback | Constructor<any>,
        shared: boolean = false
    ): void {
        this.bindings.set(
            abstract,
            this.makeBinding(abstract, concrete, shared)
        );
    }

    /**
     * Creates a new binding entry object
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|Constructor<any>} concrete
     * @param {boolean} [shared]
     *
     * @return {Binding}
     *
     * @protected
     */
    protected makeBinding(
        abstract: BindingIdentifier,
        concrete: FactoryCallback | Constructor<any>,
        shared: boolean = false,
    ): Binding {
        return new BindingEntry(abstract, concrete, shared);
    }

    /**
     * Returns the "abstract" identifier associated
     * with alias, if one exists. Otherwise, the given identifier
     * is returned
     *
     * @param {BindingIdentifier} identifier
     *
     * @protected
     *
     * @return {BindingIdentifier} Abstract identifier or given identifier itself
     */
    protected resolveAbstract(identifier: BindingIdentifier): BindingIdentifier {
        if (!this.aliases.has(identifier)) {
            return identifier;
        }

        // @ts-ignore
        return this.aliases.get(identifier);
    }

    /**
     * Determine if given is a binding
     *
     * @param {any} binding
     *
     * @return {boolean}
     *
     * @protected
     */
    protected isBinding(binding: any): boolean {
        return binding && Reflector.hasProperties(binding, [
            'abstract',
            'value',
            'shared',
            'isFactoryCallback',
            'isClassReference'
        ]);
    }

    /**
     * Determine if given is a class method reference
     *
     * @param {any} reference
     *
     * @return {boolean}
     *
     * @protected
     */
    protected isClassMethodReference(reference: any): boolean {
        return reference && Reflector.hasProperties(reference, [
            'target',
            'method',
            'parameters',
            'hasParameters',
        ]);
    }

    /**
     * Invoke class method
     *
     * When no parameters are given, this method will attempt to resolve
     * target method or callback's dependencies automatically.
     *
     * @param {ReferenceContract} reference
     * @param {...any} [methodParams] Eventual Class method parameters
     *
     * @return {any}
     *
     * @throws {BindingException}
     *
     * @protected
     */
    protected invokeClassMethod(reference: ReferenceContract, ...methodParams: any[]): any {
        // Build the target class. Note: given parameters belong to the
        // class method and MUST NOT be passed on here.
        let targetClass = this.build(reference.target as Constructor<any>);

        // Abort if target class does not contain desired method.
        let methodName = reference.method;
        if (typeof targetClass[methodName] !== 'function') {
            if (typeof methodName === 'symbol') {
                methodName = methodName.toString();
            }

            throw new BindingException(`Unable to invoke class method. Target ${targetClass} does not contain method ${methodName}`);
        }

        // Invoke the method
        return this.invokeMethod(targetClass[methodName], targetClass, ...methodParams);
    }

    /**
     * Invoke given method
     *
     * When no parameters are given, this method will attempt to resolve
     * target method or callback's dependencies automatically.
     *
     * @param {Function} method
     * @param {object} [thisArg] The value to use as "this" when invoking the method
     * @param {...any} [params] Eventual parameters to be passed on to the target method
     *
     * @return {any}
     *
     * @throws {BindingException}
     *
     * @protected
     */
    protected invokeMethod(method: Function, thisArg?: object, ...params: any[]): any {
        // Abort if not callable, e.g. if not a function was given
        if (!this.isCallable(method)) {
            let type: string = typeof method;
            throw new BindingException(`Unable to invoke method. Expected a callable method, but "${type}" was received instead`);
        }

        // Resolve the methods dependencies, if no parameters are given and
        // dependencies are registered via the dependencies reflector.
        if (params.length === 0 && this.reflector.has(method)) {
            params = this.resolveDependencies(method as Function);
        }

        // Invoke method with this argument...
        if (thisArg) {
            return method.call(thisArg, ...params);
        }

        // Invoke method without this argument
        return method(...params);
    }

    /**
     * Resolve dependencies for given target.
     *
     * Method will attempt to obtain dependencies meta information and resolve
     * each identified dependency.
     *
     * @see reflector
     *
     * @param {Constructor<any>|Function} target
     *
     * @return {any[]} List of resolved dependencies
     *
     * @throws {BindingResolutionException} If unable to resolve a dependency
     *
     * @protected
     */
    protected resolveDependencies(target: Constructor<any> | Function): any[] {
        // Obtain list of binding identifiers that might be stored as meta information
        // for given target - empty list is returned when none have been defined.
        let dependencies: BindingIdentifier[] = this.reflector.get(target);

        // Resolve each of the found identifiers. Should the make method fail,
        // then we need to capture and re-throw the binding exception, with an
        // accurate message about what binding failed.
        let resolved: any[] = [];
        dependencies.forEach((identifier: BindingIdentifier) => {
            resolved.push(this.resolveDependency(identifier, target));
        });

        // Finally, return all resolved dependencies
        return resolved;
    }

    /**
     * Resolve a single identified dependency for given target
     *
     * @param {BindingIdentifier} dependency Binding identifier resolved from a "dependency reflector"
     * @param {Constructor<any>|Function} target
     *
     * @return {any}
     *
     * @throws {BindingResolutionException} If unable to resolve given dependency
     *
     * @protected
     */
    protected resolveDependency(dependency: BindingIdentifier, target: Constructor<any> | Function): any {
        try {
            return this.make(dependency);
        } catch (e) {
            let id = dependency;
            if (typeof id === 'symbol') {
                id = id.toString();
            }

            throw new BindingResolutionException(`Unable to resolve dependency "${id}" for ${target}: ${(e as Error).message}`);
        }
    }

    /**
     * Assert binding identifier
     *
     * @param {any} identifier
     *
     * @protected
     *
     * @throws {InvalidBindingIdentifier}
     */
    protected assertBindingIdentifier(identifier: any): void {
        assertBindingIdentifier(identifier);
    }

    /**
     * Returns a string representation of the given binding identifier
     *
     * @param {BindingIdentifier} identifier
     *
     * @return {string}
     *
     * @protected
     */
    protected identifierToString(identifier: BindingIdentifier): string {
        let type: string = typeof identifier;

        switch (type) {
            case 'symbol':
                return identifier.toString();

            case 'string':
                return (identifier as string);

            default:
                return type;
        }
    }
}
