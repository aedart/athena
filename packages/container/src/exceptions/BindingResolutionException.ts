import { BindingException } from "@aedart/contracts/dist/container";
import ContainerException from "./ContainerException";

/**
 * Binding Resolution Exception
 *
 * @see BindingException
 */
export default class BindingResolutionException extends ContainerException implements BindingException {

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
