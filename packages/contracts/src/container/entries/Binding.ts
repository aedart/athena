import {
    BindingIdentifier,
    ConcreteCallback,
    ConcreteInstance
} from "../aliases";

/**
 * Binding
 */
export default interface Binding {

    /**
     * Returns the binding identifier
     */
    get abstract(): BindingIdentifier;

    /**
     * Returns the concrete instance or callback associated
     * with the binding
     */
    get concrete(): ConcreteCallback | ConcreteInstance;

    /**
     * Whether the concrete instance is a callback
     * that must be invoked by the container, to resolve
     * the concrete instance.
     */
    get isCallback(): boolean;

    /**
     * Whether this binding acts as a shared or not.
     *
     * A shared binding acts as a singleton; this same
     * concrete instance is returned from the container
     */
    get shared(): boolean;
}
