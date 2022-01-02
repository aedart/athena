/**
 * Mixin Builder
 */
export default class Builder {

    /**
     * The base class to extend
     *
     * @type {Function}
     */
    baseClass: Function;

    /**
     * Builder
     *
     * @param {Function} [baseClass]
     */
    constructor(baseClass: Function = class {}) {
        this.baseClass = baseClass;
    }

    /**
     * Merge mixins into the base class
     *
     * @param {...Function[]} mixins
     *
     * @return {Function}
     */
    with(...mixins: Function[]): Function {
        return mixins.reduce((constructorFn: Function, mixin: Function) => {
            return (typeof mixin !== 'function')
                ? constructorFn
                : mixin(constructorFn);
        }, this.baseClass);
    }
}
