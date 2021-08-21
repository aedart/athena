import { ContainerException as ContainerExceptionContract } from "@aedart/contracts/dist/container";

/**
 * Container Exception
 *
 * @see ContainerExceptionContract
 */
export default class ContainerException extends Error implements ContainerExceptionContract {

    /**
     * ContainerException
     *
     * @param message
     */
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, ContainerException.prototype);
    }
}
