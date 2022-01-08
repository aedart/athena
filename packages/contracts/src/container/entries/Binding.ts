import {
    BindingIdentifier,
    FactoryCallback,
} from "../aliases";
import {
    Constructor
} from "@aedart/contracts/dist/support"

/**
 * Binding Entry
 */
export default interface Binding {

    /**
     * Returns the binding identifier
     */
    get abstract(): BindingIdentifier;

    /**
     * Returns the callback to be invoked or reference to class that must be
     * instantiated, when requested from a service container
     */
    get value(): FactoryCallback | Constructor<any>;

    /**
     * Whether the binding value is a factory callback or not
     *
     * @see isClassReference
     */
    get isFactoryCallback(): boolean;

    /**
     * Whether the binding value is a class reference or not
     *
     * @see isFactoryCallback
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
