import {
    BindingIdentifier,
    FactoryCallback,
    ClassReference,
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
     * Returns the callback to be invoked or reference to class that must be
     * instantiated
     */
    get concrete(): FactoryCallback | ClassReference<any>;

    /**
     * Whether the concrete is a callback or not
     */
    get isCallback(): boolean;

    /**
     * Whether the concrete is a class reference or not
     */
    get isClassReference(): boolean;

    /**
     * Whether this binding acts as a shared or not.
     *
     * A shared binding acts as a singleton; this same
     * concrete instance is returned from the container
     */
    get shared(): boolean;
}
