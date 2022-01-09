import {
    AbstractOrConcreteConstructor,
    Constructor
} from "@aedart/contracts/dist/support";

/**
 * Class decorator type
 */
export type ClassDecorator<
    T extends AbstractOrConcreteConstructor<any> = any,
    U extends AbstractOrConcreteConstructor<any> = any
> = (superClass: T) => Constructor<U>;
