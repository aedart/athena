import { ClassDeterminationCallback } from "./aliases";

/**
 * Reflector
 *
 * Utility that is able to provide some meta information about
 * targets.
 */
export default class Reflector {

    /**
     * A callback that is able to determine if a target is class
     * reference or not.
     *
     * @protected
     */
    protected static classDeterminationCallback?: ClassDeterminationCallback;

    /**
     * Cache for "is class" method results.
     *
     * NOTE: Only functions / objects are cached, using a
     * weak-map, to limit the memory usage as much as
     * possible.
     *
     * @protected
     */
    protected static isClassCache: WeakMap<Function|object, boolean> = new WeakMap<Function | object, boolean>();

    /**
     * Determine if target has all the given properties
     *
     * @param {object} target
     * @param {string|symbol|(string|symbol)[]} properties
     *
     * @return {boolean}
     */
    static hasProperties(target: object, properties: string | symbol | (string | symbol)[]): boolean {
        if (!Array.isArray(properties)) {
            properties = [ properties ];
        }

        for (const property of properties) {
            if (!Reflect.has(target, property)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Determine if given target is callable
     *
     * @param {any} target
     *
     * @return {boolean}
     */
    static isCallable(target: any): boolean {
        return typeof target === 'function';
    }

    /**
     * Determine if target is a class reference
     *
     * **Caution**: By default, this method will only be able to determine classes
     * that are declared using ES6 syntax or transformed using Babel. If you testing
     * classes that are declared in a different manner, please use the
     * {@link determineClassesVia} to specify a custom callback for determining classes.
     *
     * @see determineClassesVia
     * @see defaultClassDeterminationCallback
     *
     * @param {any} target
     * @param {boolean} [force] When true, method will force determine if target is
     *                          a class reference and ignored previous cached result (if any)
     *
     * @return {boolean}
     */
    static isClass(target: any, force: boolean = false): boolean {
        // Check if previously already resolved for given target.
        // NOTE: this is only possible for functions / objects.
        let type: string = typeof target;
        let isCacheable: boolean = target !== null && (type === 'function' || type === 'object');

        if (!force && isCacheable && this.isClassCache.has(target)) {
            // @ts-ignore
            return this.isClassCache.get(target);
        }

        // Resolve whether or not target is a class references and cache
        // the result - if possible.
        let resolver: ClassDeterminationCallback = this.resolveClassDeterminationCallback();
        let result: boolean = resolver(target);
        if (isCacheable) {
            this.isClassCache.set(target, result);
        }

        return result;
    }

    /**
     * Specify the callback that is able to determine if a target is
     * a class reference or not.
     *
     * **Warning**: Setting a callback will change the default behaviour of the {@link isClass} method!
     *
     * @see isClass
     * @see defaultClassDeterminationCallback
     *
     * @param {ClassDeterminationCallback} [callback]
     *
     * @return {ClassDeterminationCallback} Previous set callback
     */
    static determineClassesVia(callback?: ClassDeterminationCallback): ClassDeterminationCallback {
        // Obtain the current (perhaps original) determination callback
        const previous: ClassDeterminationCallback = this.resolveClassDeterminationCallback();

        // Set user provided callback
        this.classDeterminationCallback = callback;

        // Finally, return previous callback
        return previous;
    }

    /**
     * Returns a default class determination callback
     *
     * @see isClass
     * @see determineClassesVia
     *
     * @return {ClassDeterminationCallback}
     */
    static defaultClassDeterminationCallback(): ClassDeterminationCallback {
        return (target: any): boolean => {
            // Ensure that target is callable
            return this.isCallable(target) &&
            (
                this.isES6DeclaredClass(target)
                || this.isBabelDeclaredClass(target)
            );
        }
    }

    /**
     * Determine if given target function is an ES6 declared class
     *
     * @param {Function} target
     *
     * @return {boolean}
     *
     * @protected
     */
    static isES6DeclaredClass(target: Function): boolean {
        // Source inspired by answer from stackoverflow answers:
        // @see https://stackoverflow.com/questions/30758961/how-to-check-if-a-variable-is-an-es6-class-declaration

        return /^\s*class(\s+|{)/.test(target.toString());
    }

    /**
     * Determine if given target is a class transformed by babel to support ES5
     * and older versions of JavaScript
     *
     * @param {Function} target
     *
     * @return {boolean}
     */
    static isBabelDeclaredClass(target: Function): boolean {
        // Source inspired by Miguel Mota's "is-class" package
        // License MIT
        // @see https://github.com/miguelmota/is-class
        // @see https://babeljs.io/docs/en/babel-plugin-transform-classes
        let source: string = target.toString();

        return (/_classCallCheck\(/.test(source) || /TypeError\("Cannot call a class as a function"\)/.test(source));
    }

    /*****************************************************************
     * Internals
     ****************************************************************/

    /**
     * Resolves the class determination callback
     *
     * @return {ClassDeterminationCallback}
     *
     * @protected
     */
    protected static resolveClassDeterminationCallback(): ClassDeterminationCallback {
        if (!this.classDeterminationCallback) {
            this.classDeterminationCallback = this.defaultClassDeterminationCallback();
        }

        return this.classDeterminationCallback;
    }
}
