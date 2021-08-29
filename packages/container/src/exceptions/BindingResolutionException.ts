import BindingException from "./BindingException"

/**
 * Binding Resolution Exception
 *
 * @see BindingException
 */
export default class BindingResolutionException extends BindingException {

    /**
     * BindingResolutionException
     *
     * @param message
     */
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, BindingResolutionException.prototype);
    }

}
