import ContainerContract, {
    BindingIdentifier,
    ClassReference,
    FactoryCallback,
    ConcreteInstance,
    Binding
} from "@aedart/contracts/dist/container";
import { DependenciesReflector as DependenciesReflectorContract  } from "@aedart/contracts/dist/reflections";
import {DependenciesReflector, Reflector} from "@aedart/reflections";
import BindingResolutionException from "./exceptions/BindingResolutionException";
import BindingEntry from "./entries/Binding";
import { assertBindingIdentifier } from "./entries/assertions";

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
    protected instancesMap: Map<BindingIdentifier, ConcreteInstance>;

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
        this.instancesMap = new Map<BindingIdentifier, ConcreteInstance>();
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
     * @return {Map<BindingIdentifier, ConcreteInstance>}
     */
    get instances(): Map<BindingIdentifier, ConcreteInstance> {
        return this.instancesMap;
    }

    /**
     * Register a binding using a callback
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|ClassReference<any>} value
     * @param {boolean} [shared] Whether binding is shared (singleton) or not
     *
     * @return {ContainerContract}
     *
     * @throws {TypeError}
     */
    bind(abstract: BindingIdentifier, value: FactoryCallback | ClassReference<any>, shared: boolean = false): ContainerContract {
        this.setBinding(abstract, value, shared);

        // @ts-ignore
        return this;
    }


    /**
     * Register a shared binding using a callback
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|ClassReference<any>} value
     *
     * @return {ContainerContract}
     *
     * @throws {TypeError}
     */
    singleton(abstract: BindingIdentifier, value: FactoryCallback | ClassReference<any>): ContainerContract {
        return this.bind(abstract, value, true);
    }

    /**
     * Register an existing instance as a shared binding
     *
     * @param {BindingIdentifier} abstract
     * @param {ConcreteInstance} instance
     *
     * @throws {TypeError}
     *
     * @return {ConcreteInstance}
     */
    instance(abstract: BindingIdentifier, instance: ConcreteInstance): ConcreteInstance {
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
     * @param {BindingIdentifier} abstract
     *
     * @return {ConcreteInstance}
     *
     * @throws {BindingException} If unable to resolve binding
     */
    get(abstract: BindingIdentifier): ConcreteInstance {
        return this.make(abstract);
    }

    /**
     * Resolve binding
     *
     * @param {BindingIdentifier} abstract
     * @param {...any} [params] Eventual parameters to be passed onto the binding
     *
     * @return {ConcreteInstance}
     *
     * @throws {BindingException} If unable to resolve binding
     */
    make(abstract: BindingIdentifier, ...params: any[]): ConcreteInstance {
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
            return this.build(abstract as ClassReference<any>, ...params);
        } else if (binding === undefined) {
            throw new BindingResolutionException('Unable to resolve abstract, no matching binding found and abstract is not buildable (not a class reference)');
        }

        // Build the binding and set instance, if binding entry is marked as "shared"
        let instance: ConcreteInstance = this.build(binding, ...params);
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
     * @param {BindingIdentifier} abstract
     * @param {ConcreteInstance} [defaultInstance] Default instance to be returned if no binding exists for given identifier
     * @param {...any} [params] Eventual parameters to be passed onto the binding
     *
     * @return {ConcreteInstance}
     *
     * @throws {BindingException} If unable to resolve binding
     */
    makeOrDefault(abstract: BindingIdentifier, defaultInstance: ConcreteInstance = null, ...params: any[]): ConcreteInstance {
        if (!this.has(abstract) && !this.isBuildable(abstract)) {
            return defaultInstance;
        }

        return this.make(abstract, ...params);
    }

    /**
     * Builds a concrete instance from given binding or class constructor reference
     *
     * @param {ClassReference<any>|Binding} target
     * @param {...any} [params]
     *
     * @return {ConcreteInstance}
     *
     * @throws {BindingResolutionException}
     */
    build(target: ClassReference<any> | Binding, ...params: any[]): ConcreteInstance {
        // Abort when no target given
        if (!target) {
            throw new BindingResolutionException('Unable to build, no target binding or class reference given');
        }

        // When target is a binding and of the type factory callback, then resolve
        // it by invoking the callback with given parameters.
        if (this.isBinding(target) && (target as Binding).isFactoryCallback) {
            return this.resolveBindingCallback((target as Binding), ...params);
        }

        // When target is a binding of the type calls reference,
        // then set the target to the binding's value so it can be resolved.
        if (this.isBinding(target)) {
            target = (target as Binding).value as ClassReference<any>;
        }

        // Fail in case that target is not buildable (in case that target was not
        // a binding)
        if (!this.isBuildable(target)) {
            throw new BindingResolutionException('Target is not buildable (not a class reference)');
        }

        // At this point, we are sure that the target is a class reference
        // and must be instantiated. But, we need to deal with eventual
        // dependencies. Therefore, when - and only when - no parameters
        // are provided, we must attempt to resolve eventual dependencies
        // by means of meta information, if it's available for the target.
        if (params.length === 0 && this.reflector.has(target)) {
            params = this.resolveDependencies(target as ClassReference<any>);
        }

        // Finally, create a new instance with the given or resolved params
        return new (target as ClassReference<any>)(...params);
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
     * Flush container of all of it's bindings and resolved instances
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
        return new DependenciesReflector();
    }

    /**
     * Invokes the binding callback and returns the resulting concrete instance
     *
     * @param {Binding} binding
     * @param {...any} [params]
     *
     * @return {ConcreteInstance}
     *
     * @throws {BindingResolutionException}
     *
     * @protected
     */
    protected resolveBindingCallback(binding: Binding, ...params: any[]): ConcreteInstance {
        try {
            return (binding.value as FactoryCallback)(this, ...params);
        } catch (e) {
            throw new BindingResolutionException('Unable to resolve binding "' + this.identifierToString(binding.abstract) + '", due to: ' + e.message);
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
     * Set a binding in this container
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|ConcreteInstance} concrete
     * @param {boolean} [shared]
     *
     * @protected
     */
    protected setBinding(
        abstract: BindingIdentifier,
        concrete: FactoryCallback | ConcreteInstance,
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
     * @param {FactoryCallback|ConcreteInstance} concrete
     * @param {boolean} [shared]
     *
     * @return {Binding}
     *
     * @protected
     */
    protected makeBinding(
        abstract: BindingIdentifier,
        concrete: FactoryCallback | ConcreteInstance,
        shared: boolean = false,
    ): Binding {
        return new BindingEntry(abstract, concrete, shared);
    }

    /**
     * Returns the "abstract" identifier associated
     * with alias, if one exists. Otherwise given identifier
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
        // In the future, this might be replaced with a simple "instance of" check
        return binding
            && binding.hasOwnProperty('abstract')
            && binding.hasOwnProperty('concrete')
            && binding.hasOwnProperty('isCallback')
            && binding.hasOwnProperty('shared');
    }

    /**
     * Resolve dependencies for given target.
     *
     * Method will attempt to obtain dependencies meta information and resolve
     * each identified dependency.
     *
     * @see reflector
     *
     * @param {ClassReference<any>|Function} target
     *
     * @return {any[]} List of resolved dependencies
     *
     * @throws {BindingResolutionException} If unable to resolve a dependency
     *
     * @protected
     */
    protected resolveDependencies(target: ClassReference<any> | Function): any[] {
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
     * @param {ClassReference<any>|Function} target
     *
     * @return {any}
     *
     * @throws {BindingResolutionException} If unable to resolve given dependency
     *
     * @protected
     */
    protected resolveDependency(dependency: BindingIdentifier, target: ClassReference<any> | Function): any {
        try {
            return this.make(dependency);
        } catch (e) {
            let id = dependency;
            if (typeof id === 'symbol') {
                id = id.toString();
            }

            throw new BindingResolutionException(`Unable to resolve dependency "${id}" for ${target}: ${e.message}`);
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
                // @ts-ignore
                return identifier;

            default:
                return type;
        }
    }
}
