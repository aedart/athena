import { NotFoundException as NotFoundExceptionContract } from "@aedart/contracts/dist/container";
import ContainerException from "./ContainerException";

/**
 * Not Found Exception
 *
 * @see NotFoundExceptionContract
 */
export default class NotFoundException extends ContainerException implements NotFoundExceptionContract {

    /**
     * NotFoundException
     *
     * @param message
     */
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, NotFoundException.prototype);
    }

}
