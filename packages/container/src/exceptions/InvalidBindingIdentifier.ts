import BindingException from "./BindingException"

/**
 * Invalid Binding Identifier Exception
 *
 * Should be thrown whenever a binding identifier is invalid
 *
 * @see BindingException
 */
export default class InvalidBindingIdentifier extends BindingException {

    /**
     * InvalidBindingIdentifier
     *
     * @param message
     */
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, InvalidBindingIdentifier.prototype);
    }

}
