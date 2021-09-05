import { ClassReference } from "@aedart/contracts/dist/container";
import { TargetMethodReference } from "@aedart/contracts/src/support/aliases";
import {
    Reference as ReferenceContract,
    __INVOKE
} from "@aedart/contracts/dist/support";

/**
 * Class Method Reference
 *
 * @see {ReferenceContract}
 */
export default class Reference implements ReferenceContract {

    /**
     * Target class reference
     *
     * @protected
     */
    protected _target: ClassReference<any> | object;

    /**
     * Method in target class to be invoked
     *
     * @protected
     */
    protected _method: string | symbol;

    /**
     * List of parameters to be passed on to the method
     *
     * @protected
     */
    protected params: any[] = [];

    /**
     * Reference
     *
     * @param {ClassReference<any>|object} target
     * @param {string|symbol} [method]
     */
    constructor(target: ClassReference<any> | object, method: string | symbol = __INVOKE) {
        this._target = target
        this._method = method;
    }

    /**
     * Creates a new Reference
     *
     * @param {ClassReference<any>} target
     * @param {string|symbol} [method]
     *
     * @return {ReferenceContract}
     */
    static make(target: ClassReference<any> | object, method: string | symbol = __INVOKE): Reference {
        return new this(target, method);
    }

    /**
     * Creates a new Reference from an array that contains
     * a target and method reference
     *
     * @param {TargetMethodReference} arr
     *
     * @return {ReferenceContract}
     */
    static fromArray(arr: TargetMethodReference): Reference {
        return this.make(arr[0], arr[1]);
    }

    /**
     * Add one or more parameters which must be
     * passed on to the target class method, when
     * it is invoked (_outside the scope of class reference_)
     *
     * @param {...any} params
     *
     * @return {ReferenceContract}
     */
    with(...params: any[]): ReferenceContract {
        params.forEach((param: any) => {
            this.params.push(param);
        })

        return this;
    }

    /**
     * Determine whether parameters have been provided or not
     *
     * @return {boolean}
     */
    get hasParameters(): boolean {
        return this.params.length > 0;
    }

    /**
     * The parameters to be passed on to target class method
     *
     * @return {any[]}
     */
    get parameters(): any[] {
        return this.params;
    }

    /**
     * Target class reference
     *
     * @return {ClassReference<any>|object}
     */
    get target(): ClassReference<any> | object {
        return this._target;
    }

    /**
     * Method in target class to be invoked
     *
     * @return {string|symbol}
     */
    get method(): string | symbol {
        return this._method;
    }
}
