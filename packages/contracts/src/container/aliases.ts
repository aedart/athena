import Container from "./Container";

/**
 * A binding identifier (also known as "abstract") can consist
 * of several types; a string, a symbol or perhaps a function.
 *
 * It is commonly paired with a "concrete" object instance,
 * function or other type of value.
 *
 * @see ConcreteInstance
 */
export type BindingIdentifier = string | Function | symbol | object;

/**
 * The concrete instance of a binding
 *
 * @see BindingIdentifier
 */
export type ConcreteInstance = any;

/**
 * A callback method that must return a concrete instance
 */
export type FactoryCallback = (container: Container, ...params: any[]) => ConcreteInstance;
