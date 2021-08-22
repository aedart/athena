import ContainerContract, {
    BindingIdentifier,
    FactoryCallback,
    ConcreteInstance,
    Binding
} from "@aedart/contracts/dist/container";
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
            return this.setInstance(new this());
        }

        return this.instance;
    }

    /**
     * Set the singleton instance of the container
     *
     * @param {ContainerContract} container
     *
     * @return {ContainerContract}
     */
    static setInstance(container: ContainerContract): ContainerContract {
        this.instance = container;

        return this.instance;
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

    get(abstract: BindingIdentifier): ConcreteInstance {
        return undefined;
    }

    make(abstract: BindingIdentifier, ...params: any[]): ConcreteInstance {
        return undefined;
    }

    tryMake(abstract: BindingIdentifier, defaultInstance: ConcreteInstance = null, ...params: any[]): ConcreteInstance {
        return undefined;
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
     * Set a binding in this container
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|ConcreteInstance} [concrete]
     * @param {boolean} [shared]
     * @param {boolean} [isCallback]
     *
     * @protected
     */
    protected setBinding(
        abstract: BindingIdentifier,
        concrete: FactoryCallback | ConcreteInstance = null,
        shared: boolean = false,
        isCallback: boolean = false
    ): void {
        let binding = new BindingEntry(abstract, concrete, shared, isCallback);

        this.bindings.set(abstract, binding);
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
}
