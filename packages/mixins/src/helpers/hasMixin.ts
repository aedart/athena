import isApplicationOf from "./isApplicationOf";

/**
 * Determine if given instance has mixin
 *
 * @param {Object} instance
 * @param {Function} mixin
 *
 * @return {boolean}
 */
export default function(instance: Object, mixin: Function): boolean {
    while (instance !== null) {
        if (isApplicationOf(instance, mixin)) {
            return true;
        }

        instance = Object.getPrototypeOf(instance);
    }

    // Nothing found, thus it cannot be an instance of given
    return false;
}
