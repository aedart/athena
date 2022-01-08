import {
    Constructor,
    AbstractConstructor
} from "@aedart/contracts/dist/support";
import Container from "./Container";

/**
 * A binding identifier (also known as "abstract") can consist
 * of several types; a string, a symbol, function or constructor.
 *
 * It is commonly paired with a "concrete" object instance,
 * function or other type of value.
 *
 * @see Resolved
 */
export type BindingIdentifier = string | Function | symbol | object | Constructor<any> | AbstractConstructor<any>;

/**
 * Resolved value from service container, e.g. for a binding
 *
 * @see BindingIdentifier
 */
export type Resolved<T = any> = T;

/**
 * A callback method that must return a resolved value
 */
export type FactoryCallback<T = any> = (container: Container, ...params: any[]) => Resolved<T>;
