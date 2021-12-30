'use strict';

/**
 * Greeter identifier
 *
 * @type {symbol}
 */
export const GREETER_IDENTIFIER = Symbol('@aedart/tests/facades/test-greeter');

/**
 * Greeter
 *
 * "[...] a person employed to greet customers at a shop, restaurant, or other business. [...]" from Collins
 * @see https://www.collinsdictionary.com/dictionary/english/greeter
 *
 * FOR TESTING PURPOSES ONLY
 */
export default class Greeter {

    /**
     * Name of customer
     *
     * @protected
     *
     * @type {string|null}
     */
    _customer = null;

    /**
     * Set name of the customer
     *
     * @param {string} name
     */
    set customer(name) {
        this._customer = name;
    }

    /**
     * Get name of the customer
     *
     * @return {string|null}
     */
    get customer() {
        return this._customer;
    }

    /**
     * Returns the greetings to the customer
     *
     * @return {string}
     */
    greetings() {
        return this.sayWelcome(this.customer);
    }

    /**
     * Say "welcome" to the given person
     *
     * @param {string} person Name of person
     *
     * @return {string}
     */
    sayWelcome(person) {
        return `Welcome ${person}`;
    }
}
