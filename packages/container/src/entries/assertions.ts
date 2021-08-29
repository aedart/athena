import { Reflector } from "@aedart/reflections";
import InvalidBindingIdentifier from "../exceptions/InvalidBindingIdentifier";
import InvalidBindingValue from "../exceptions/InvalidBindingValue";

/**
 * Assert binding entry identifier
 *
 * @param {any} identifier
 *
 * @throws {InvalidBindingIdentifier}
 */
export function assertBindingIdentifier(identifier: any): void {
    if (identifier === null) {
        throw new InvalidBindingIdentifier('Invalid binding identifier. Null cannot be used as a binding identifier');
    }

    let allowed: string[] = ['function', 'symbol', 'string', 'object'];
    let type: string = typeof identifier;

    if (allowed.indexOf(type) === -1) {
        throw new InvalidBindingIdentifier('Invalid binding identifier. Expected either of: ' + allowed.join(', ') + '. Got "' + type + '" instead');
    }
}

/**
 * Assert binding entry value
 *
 * @param {any} value
 *
 * @throws {InvalidBindingValue}
 */
export function assertBindingValue(value: any): void {
    if (!(Reflector.isCallable(value) || Reflector.isClass(value))) {
        throw new InvalidBindingValue('Invalid binding value. Expected a factory callback method or a class reference');
    }
}
