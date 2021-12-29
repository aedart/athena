import {
    BindingIdentifier,
    FactoryCallback,
    ConcreteInstance,
    ClassReference
} from "./aliases";
import Binding from "./entries/Binding";
import {
    Reference,
    TargetMethodReference
} from "@aedart/contracts/dist/support";

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
     * @param value
     * @param shared Whether binding is shared (singleton) or not
     *
     * @throws {TypeError}
     */
    bind(abstract: BindingIdentifier, value: FactoryCallback | ClassReference<any>, shared: boolean): Container;

    /**
     * Register a shared binding using a callback
     *
     * @param abstract
     * @param value
     *
     * @throws {TypeError}
     */
    singleton(abstract: BindingIdentifier, value: FactoryCallback | ClassReference<any>): Container;

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
    alias(abstract: BindingIdentifier, alias: BindingIdentifier): Container;

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
     * @throws {BindingException} If unable to resolve binding
     */
    get(abstract: BindingIdentifier): ConcreteInstance;

    /**
     * Resolve binding
     *
     * @param abstract
     * @param params Eventual parameters to be passed onto the binding
     *
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
     * Builds a concrete instance from given binding or class constructor reference
     *
     * @param target
     * @param params
     *
     * @throws {BindingResolutionException}
     */
    build(target: ClassReference<any> | Binding, ...params: any[]): ConcreteInstance;

    /**
     * Call the given method or callback and inject its dependencies
     *
     * When no parameters are given, this method will attempt to resolve
     * target method or callback's dependencies automatically.
     *
     * @param method Method or callback to be invoked
     * @param params Eventual parameters to be passed on to the target method
     *
     * @throws {BindingException}
     */
    call(method: Function | TargetMethodReference | Reference, ...params: any[]): any;

    /**
     * Remove binding from this container
     *
     * @param abstract
     */
    forget(abstract: BindingIdentifier): void;

    /**
     * Flush container of all its bindings and resolved instances
     */
    flush(): void;
}
