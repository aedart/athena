import ContainerContract, {
    BindingIdentifier,
    FactoryCallback,
    ConcreteInstance,
    Binding
} from "@aedart/contracts/dist/container";
import BindingResolutionException from "./exceptions/BindingResolutionException";
import NotFoundException from "./exceptions/NotFoundException";
import BindingEntry from "./entries/Binding";

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
     * @param {FactoryCallback} concrete
     * @param {boolean} [shared] Whether binding is shared (singleton) or not
     *
     * @throws {TypeError}
     */
    bind(abstract: BindingIdentifier, concrete: FactoryCallback, shared: boolean = false): void {
        this.assertBindingIdentifier(abstract);
        this.assertFactoryCallback(concrete);

        this.setBinding(abstract, concrete, shared, true);
    }

    /**
     * Register a shared binding using a callback
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback} concrete
     *
     * @throws {TypeError}
     */
    singleton(abstract: BindingIdentifier, concrete: FactoryCallback): void {
        this.assertBindingIdentifier(abstract);
        this.assertFactoryCallback(concrete);

        this.setBinding(abstract, concrete, true, true);
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

        this.setBinding(abstract, instance, true);

        return instance;
    }

    /**
     * Define an alias for the given binding identifier
     *
     * @param {BindingIdentifier} abstract
     * @param {BindingIdentifier} alias
     *
     * @throws {TypeError}
     */
    alias(abstract: BindingIdentifier, alias: BindingIdentifier): void {
        this.assertBindingIdentifier(abstract);
        this.assertBindingIdentifier(alias);

        if (abstract === alias) {
            throw new TypeError('Unable to create binding alias to itself');
        }

        this.aliases.set(alias, abstract);
    }

    /**
     * Determine if a binding exists for given identifier
     *
     * @param {BindingIdentifier} abstract
     *
     * @return {boolean}
     */
    has(abstract: BindingIdentifier): boolean {
        return this.bindings.has(abstract) || this.instances.has(abstract) || this.aliases.has(abstract);
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
     * @throws {NotFoundException} If no concrete instance was found for given identifier
     * @throws {ContainerException} If unable to resolve binding
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
     * @throws {NotFoundException} If no concrete instance was found for given identifier
     * @throws {BindingException} If unable to resolve binding
     */
    make(abstract: BindingIdentifier, ...params: any[]): ConcreteInstance {
        // Resolve identifier, if an alias was given
        abstract = this.resolveAbstract(abstract);

        // Return singleton instance, if requested identifier matches a previously initiated instance
        if(this.instances.has(abstract)){
            return this.instances.get(abstract);
        }

        // Find binding entry object - or fail
        let binding = this.findBinding(abstract);

        // Attempt to build concrete instance from binding
        let instance = this.build(binding, ...params);

        // Set instance, if binding entry is marked as "shared"
        if(binding.shared){
            this.instances.set(abstract, instance);
        }

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
        if (!this.has(abstract)) {
            return defaultInstance;
        }

        return this.make(abstract, ...params);
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

    /*****************************************************************
     * Internals
     ****************************************************************/

    /**
     * Builds a concrete instance from given binding or function
     *
     * @param {Function|Binding} concrete
     * @param {...any} [params]
     *
     * @return {ConcreteInstance}
     *
     * @throws {BindingResolutionException}
     *
     * @protected
     */
    protected build(concrete: Function | Binding, ...params: any[]): ConcreteInstance {
        // Resolve from binding entry object, if that is provided
        if (this.isBinding(concrete)) {
            // @ts-ignore
            return this.resolveFromBinding(concrete, ...params);
        }

        // TODO: Resolve dependencies... meta reflections, etc...
        throw new BindingResolutionException('TODO: Implement meta reflection and "auto" dependency injection');

        // // Unlike PHP, JavaScript still does not have much to offer, when
        // // it comes to class reflections. There is no way that we can tell
        // // what kind of "types" might be expected on a concrete instance.
        // // Therefore, the only way we can build the instance with the correct
        // // dependencies (if any), is to check if some "meta data" has been
        // // defined for the instance.
        // //
        // // But, we only do so, if empty params are given. This way, if the
        // // developer desires to build an instance with a different set of
        // // dependencies, then that should be allowed.
        // //
        // // Lastly, because we accept an object or an array, we need to
        // // convert the params into an array, if an object was provided.
        // if( ! Array.isArray(parameters)){
        //     parameters = Object.keys(parameters).map(key => parameters[key]);
        // }
        //
        // if(Meta.hasClass(concrete) && parameters.length == 0){
        //     parameters = this.getDependencies(concrete);
        // }
        //
        // // Finally, initiate the new instance
        // return new concrete(...parameters);
    }

    /**
     * Resolve concrete instance from given binding entry object
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
    protected resolveFromBinding(binding: Binding, ...params: any[]): ConcreteInstance {
        // If a concrete instance (of any kind) was bound, return it
        if (!binding.isCallback) {
            return binding.concrete;
        }

        // Otherwise, a callback must be invoked, with provided parameters
        try {
            return binding.concrete(this, ...params);
        } catch (e) {
            throw new BindingResolutionException('Unable to resolve binding "' + this.identifierToString(binding.abstract) + '", due to: ' + e.message);
        }
    }

    /**
     * Set a binding in this container
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|ConcreteInstance} concrete
     * @param {boolean} [shared]
     * @param {boolean} [isCallback]
     *
     * @protected
     */
    protected setBinding(
        abstract: BindingIdentifier,
        concrete: FactoryCallback | ConcreteInstance,
        shared: boolean = false,
        isCallback: boolean = false
    ): void {
        this.bindings.set(
            abstract,
            this.makeBinding(abstract, concrete, shared, isCallback)
        );
    }

    /**
     * Creates a new binding entry object
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|ConcreteInstance} concrete
     * @param {boolean} [shared]
     * @param {boolean} [isCallback]
     *
     * @return {Binding}
     *
     * @protected
     */
    protected makeBinding(
        abstract: BindingIdentifier,
        concrete: FactoryCallback | ConcreteInstance,
        shared: boolean = false,
        isCallback: boolean = false
    ): Binding {
        return new BindingEntry(abstract, concrete, shared, isCallback);
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
     * Finds and returns binding for given identifier or fails
     *
     * NOTE: Method does NOT check for aliases!
     *
     * @param {BindingIdentifier} abstract
     *
     * @returns {Binding}
     *
     * @throws {NotFoundException} If unable to find binding for abstract
     */
    protected findBinding(abstract: BindingIdentifier): Binding {
        if( ! this.bindings.has(abstract)){
            throw new NotFoundException('No binding found for identifier: "' + this.identifierToString(abstract) + '"');
        }

        // @ts-ignore
        return this.bindings.get(abstract);
    }

    /**
     * Assert binding identifier
     *
     * @param {any} identifier
     *
     * @protected
     *
     * @throws {TypeError}
     */
    protected assertBindingIdentifier(identifier: any): void {
        let allowed: string[] = ['function', 'symbol', 'string', 'object'];
        let type: string = typeof identifier;

        if (allowed.indexOf(type) === -1) {
            throw new TypeError('Invalid binding identifier. Expected either of: ' + allowed.join(', ') + '. Got "' + type + '" instead');
        }
    }

    /**
     * Assert factory callback
     *
     * @param {any} callback
     *
     * @protected
     *
     * @throws {TypeError}
     */
    protected assertFactoryCallback(callback: any): void {
        let type: string = typeof callback;
        if (type !== 'function') {
            throw new TypeError('Invalid factory callback. Expected a function, but got "' + type + '" instead');
        }
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
