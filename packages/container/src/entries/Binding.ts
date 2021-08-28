import {
    Binding as BindingContract,
    BindingIdentifier,
    FactoryCallback,
    ClassReference,
} from "@aedart/contracts/dist/container";

/**
 * Binding
 *
 * @see BindingContract
 */
export default class Binding implements BindingContract {

    /**
     * The abstract abstractIdentifier of this binding
     *
     * @protected
     */
    protected readonly abstractIdentifier: BindingIdentifier;

    /**
     * Concrete value of binding
     *
     * @protected
     */
    protected readonly concreteValue: FactoryCallback | ClassReference<any>;

    /**
     * State whether binding is shared or not
     *
     * @protected
     */
    protected readonly isShared: boolean;

    /**
     * State whether binding's concrete value is of type callback
     * or not
     *
     * @protected
     */
    protected readonly isOfTypeCallback: boolean;

    /**
     * Binding
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|ClassReference<any>} concrete
     * @param {boolean} [shared]
     * @param {boolean} [isCallback]
     */
    constructor(
        abstract: BindingIdentifier,
        concrete: FactoryCallback | ClassReference<any>,
        shared: boolean = false,
        isCallback: boolean = false
    ) {
        this.abstractIdentifier = abstract;
        this.concreteValue = concrete;
        this.isShared = shared;
        this.isOfTypeCallback = isCallback;
    }

    /**
     * Returns the binding abstractIdentifier
     *
     * @return {BindingIdentifier}
     */
    get abstract(): BindingIdentifier {
        return this.abstractIdentifier;
    }

    /**
     * Returns the concrete instance or callback associated
     * with the binding
     *
     * @return {FactoryCallback|ClassReference<any>}
     */
    get concrete(): FactoryCallback | ClassReference<any> {
        return this.concreteValue;
    }

    /**
     * Whether the concrete instance is a callback
     * that must be invoked by the container, to resolve
     * the concrete instance.
     *
     * @return {boolean}
     */
    get isCallback(): boolean {
        return this.isOfTypeCallback;
    }

    /**
     * Whether the concrete is a class reference or not
     *
     * @return {boolean}
     */
    get isClassReference(): boolean {
        return !this.isCallback;
    }

    /**
     * Whether this binding acts as a shared or not.
     *
     * A shared binding acts as a singleton; this same
     * concrete instance is returned from the container
     *
     * @return {boolean}
     */
    get shared(): boolean {
        return this.isShared;
    }
}
