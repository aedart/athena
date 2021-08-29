import DependenciesReflector from "./dependencies/DependenciesReflector";
import {
    dependsOn
} from "./dependencies/decorators";
import { ClassDeterminationCallback } from "./aliases";
import Reflector from "./Reflector";

export {
    ClassDeterminationCallback,
    Reflector,

    // (Meta) Dependencies Reflector
    DependenciesReflector,
    dependsOn
}
