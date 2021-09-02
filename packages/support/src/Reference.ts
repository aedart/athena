import { ClassReference } from "@aedart/contracts/dist/container";
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
    protected targetClass: ClassReference<any>;

    /**
     * Method in target class to be invoked
     *
     * @protected
     */
    protected methodName: string | symbol;

    /**
     * List of parameters to be passed on to the method
     *
     * @protected
     */
    protected params: any[] = [];

    /**
     * Reference
     *
     * @param {ClassReference<any>} target
     * @param {string|symbol} [method]
     */
    constructor(target: ClassReference<any>, method: string | symbol = __INVOKE) {
        this.targetClass = target
        this.methodName = method;
    }

    /**
     * Creates a new Class Method Reference
     *
     * @param {ClassReference<any>} target
     * @param {string|symbol} [method]
     */
    static make(target: ClassReference<any>, method: string | symbol = __INVOKE): Reference {
        return new this(target, method);
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
     * @return {ClassReference<any>}
     */
    get target(): ClassReference<any> {
        return this.targetClass;
    }

    /**
     * Method in target class to be invoked
     *
     * @return {string|symbol}
     */
    get method(): string | symbol {
        return this.methodName;
    }
}
