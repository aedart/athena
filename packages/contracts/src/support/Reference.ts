import { ClassReference } from "@aedart/contracts/dist/container";

/**
 * A default method to be invoked, when no method name is provided
 *
 * This is heavily inspired by PHP's magic method of the same name.
 *
 * @see https://www.php.net/manual/en/language.oop5.magic.php#object.invoke
 */
export const __INVOKE: unique symbol = Symbol('__invoke');

/**
 * Class Method Reference
 *
 * Keeps track of a class reference and a method, that at some point
 * must be invoked.
 */
export default interface Reference {

    /**
     * Add one or more parameters which must be
     * passed on to the target class method, when
     * it is invoked (_outside the scope of class reference_)
     *
     * @param params
     */
    with(...params: any[]): Reference ;

    /**
     * Determine whether parameters have been provided or not
     */
    get hasParameters(): boolean

    /**
     * The parameters to be passed on to target class method
     */
    get parameters(): any[];

    /**
     * Target class reference
     */
    get target(): ClassReference<any> ;

    /**
     * Method in target class to be invoked
     */
    get method(): string | symbol;
}
