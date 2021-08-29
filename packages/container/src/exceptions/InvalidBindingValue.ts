import BindingException from "./BindingException"

/**
 * Invalid Binding Value Exception
 *
 * Should be thrown whenever a binding value is invalid
 *
 * @see BindingException
 */
export default class InvalidBindingValue extends BindingException {

    /**
     * InvalidBindingIdentifier
     *
     * @param message
     */
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidBindingValue.prototype);
    }

}
