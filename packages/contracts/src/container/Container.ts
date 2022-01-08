import {
    BindingIdentifier,
    FactoryCallback,
    Resolved,
} from "./aliases";
import Binding from "./entries/Binding";
import {
    Reference,
    TargetMethodReference,
    Constructor,
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
    get instances(): Map<BindingIdentifier, Resolved>;

    /**
     * Register a binding using a callback
     *
     * @param abstract
     * @param value
     * @param [shared] Whether binding is shared (singleton) or not
     *
     * @throws {TypeError}
     */
    bind(abstract: BindingIdentifier, value: FactoryCallback | Constructor<any>, shared?: boolean): Container;

    /**
     * Register a shared binding using a callback
     *
     * @param abstract
     * @param value
     *
     * @throws {TypeError}
     */
    singleton(abstract: BindingIdentifier, value: FactoryCallback | Constructor<any>): Container;

    /**
     * Register an existing instance as a shared binding
     *
     * @param abstract
     * @param instance
     *
     * @throws {TypeError}
     */
    instance<T = any>(abstract: BindingIdentifier, instance: Resolved<T>): Resolved<T>;

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
    get<T = any>(abstract: BindingIdentifier): Resolved<T>;

    /**
     * Resolve binding
     *
     * @param abstract
     * @param params Eventual parameters to be passed onto the binding
     *
     * @throws {BindingException} If unable to resolve binding
     */
    make<T = any>(abstract: BindingIdentifier, ...params: any[]): Resolved<T>;

    /**
     * Attempt to resolve binding and return it's concrete instance or return
     * a default, if no concrete instance exists for given identifier.
     *
     * Note: The method might still fail, in case of the biding cannot be resolved.
     *
     * @param abstract
     * @param defaultValue Default value to be returned if no binding exists for given identifier
     * @param params Eventual parameters to be passed onto the binding
     *
     * @throws {BindingException} If unable to resolve binding
     */
    makeOrDefault<T = any, U = any>(abstract: BindingIdentifier, defaultValue: Resolved<U> | null, ...params: any[]): Resolved<T> | Resolved<U> | null;

    /**
     * Builds a concrete instance from given binding or class constructor reference
     *
     * @param target
     * @param params
     *
     * @throws {BindingResolutionException}
     */
    build<T = any>(target: Constructor<any> | Binding, ...params: any[]): Resolved<T>;

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
