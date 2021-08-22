import {
    BindingIdentifier, FactoryCallback,
    ConcreteInstance
} from "./aliases";
import Binding from "./entries/Binding";

/**
 * Container identifier
 */
export const CONTAINER: unique symbol = Symbol('@aedart/contracts/container');

/**
 * Service Container
 */
export default interface Container {

    /**
     * Map of this container's bindings
     */
    get bindings(): Map<BindingIdentifier, Binding>;

    /**
     * Map of binding aliases
     */
    get aliases(): Map<BindingIdentifier, BindingIdentifier>;

    /**
     * Map of shared instances (singletons)
     */
    get instances(): Map<BindingIdentifier, ConcreteInstance>;

    /**
     * Register a binding using a callback
     *
     * @param abstract
     * @param concrete
     * @param shared Whether binding is shared (singleton) or not
     *
     * @throws {TypeError}
     */
    bind(abstract: BindingIdentifier, concrete: FactoryCallback, shared: boolean): void;

    /**
     * Register a shared binding using a callback
     *
     * @param abstract
     * @param concrete
     *
     * @throws {TypeError}
     */
    singleton(abstract: BindingIdentifier, concrete: FactoryCallback): void;

    /**
     * Register an existing instance as a shared binding
     *
     * @param abstract
     * @param instance
     *
     * @throws {TypeError}
     */
    instance(abstract: BindingIdentifier, instance: ConcreteInstance): ConcreteInstance;

    /**
     * Define an alias for the given binding identifier
     *
     * @param abstract
     * @param alias
     *
     * @throws {TypeError}
     */
    alias(abstract: BindingIdentifier, alias: BindingIdentifier): void;

    /**
     * Determine if a binding exists for given identifier
     *
     * @param abstract
     */
    has(abstract: BindingIdentifier): boolean;

    /**
     * Alias for {@link has} method
     *
     * @param abstract
     */
    bound(abstract: BindingIdentifier): boolean;

    /**
     * Find and resolve concrete instance that matches given identifier
     *
     * @param abstract
     *
     * @throws {NotFoundException} If no concrete instance was found for given identifier
     * @throws {ContainerException} If unable to resolve binding
     */
    get(abstract: BindingIdentifier): ConcreteInstance;

    /**
     * Resolve binding
     *
     * @param abstract
     * @param params Eventual parameters to be passed onto the binding
     *
     * @throws {NotFoundException} If no concrete instance was found for given identifier
     * @throws {BindingException} If unable to resolve binding
     */
    make(abstract: BindingIdentifier, ...params: any[]): ConcreteInstance;

    /**
     * Attempt to resolve binding and return it's concrete instance or return
     * a default, if no concrete instance exists for given identifier.
     *
     * Note: The method might still fail, in case of the biding cannot be resolved.
     *
     * @param abstract
     * @param defaultInstance Default instance to be returned if no binding exists for given identifier
     * @param params Eventual parameters to be passed onto the binding
     *
     * @throws {BindingException} If unable to resolve binding
     */
    makeOrDefault(abstract: BindingIdentifier, defaultInstance: ConcreteInstance, ...params: any[]): ConcreteInstance;

    /**
     * Remove binding from this container
     *
     * @param abstract
     */
    forget(abstract: BindingIdentifier): void;

    /**
     * Flush container of all of it's bindings and resolved instances
     */
    flush(): void;
}
