import ServiceProvider from "./services/ServiceProvider";
import Bootable from "./services/Bootable";
import Reference, { __INVOKE } from "./Reference";
import {
    Constructor,
    AbstractConstructor,
    AbstractOrConcreteConstructor,
    TargetMethodReference
} from "./aliases";

export {
    __INVOKE,
    Reference,

    // Type aliases
    Constructor,
    AbstractConstructor,
    AbstractOrConcreteConstructor,
    TargetMethodReference,

    // Services
    ServiceProvider,
    Bootable
}
