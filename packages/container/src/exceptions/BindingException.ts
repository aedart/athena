import { BindingException as BindingExceptionContract } from "@aedart/contracts/dist/container";
import ContainerException from "./ContainerException";

/**
 * Binding Exception
 *
 * @see BindingException
 */
export default class BindingException extends ContainerException implements BindingExceptionContract {

    /**
     * BindingException
     *
     * @param message
     */
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, BindingException.prototype);
    }

}
