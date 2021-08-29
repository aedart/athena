import {
    Binding as BindingContract,
    BindingIdentifier,
    FactoryCallback,
    ClassReference,
} from "@aedart/contracts/dist/container";
import {
    assertBindingIdentifier,
    assertBindingValue
} from "./assertions";
import { Reflector } from "@aedart/reflections";

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
     * Binding
     *
     * @param {BindingIdentifier} abstract
     * @param {FactoryCallback|ClassReference<any>} value
     * @param {boolean} [shared]
     *
     * @throws {InvalidBindingIdentifier}
     * @throws {InvalidBindingValue}
     */
    constructor(
        abstract: BindingIdentifier,
        value: FactoryCallback | ClassReference<any>,
        shared: boolean = false,
    ) {
        this.assertBindingIdentifier(abstract);
        this.assertBindingValue(value);

        this.abstractIdentifier = abstract;
        this.concreteValue = value;
        this.isShared = shared;
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
     * Returns the callback to be invoked or reference to class that must be
     * instantiated, when requested from a service container
     *
     * @return {FactoryCallback|ClassReference<any>}
     */
    get value(): FactoryCallback | ClassReference<any> {
        return this.concreteValue;
    }

    /**
     * Whether the binding value is a factory callback or not
     *
     * @see isClassReference
     *
     * @return {boolean}
     */
    get isFactoryCallback(): boolean {
        return !this.isClassReference;
    }

    /**
     * Whether the binding value is a class reference or not
     *
     * @see isFactoryCallback
     *
     * @return {boolean}
     */
    get isClassReference(): boolean {
        return Reflector.isClass(this.value);
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

    /*****************************************************************
     * Internals
     ****************************************************************/

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
     * Assert binding value
     *
     * @param {any} value
     *
     * @protected
     *
     * @throws {InvalidBindingValue}
     */
    protected assertBindingValue(value: any) {
        assertBindingValue(value);
    }
}
