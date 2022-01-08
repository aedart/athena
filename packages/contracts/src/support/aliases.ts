/**
 * Constructor type
 */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * Abstract constructor type
 */
export type AbstractConstructor<T> = abstract new (...args: any[]) => T;

/**
 * Abstract or concrete constructor type
 */
export type AbstractOrConcreteConstructor<T> = Constructor<T> | AbstractConstructor<T>;

/**
 * Class method reference, in the form of an array with
 * fixed elements.
 *
 * THe first element is the target class reference or object.
 * The second element the method to be invoked in the target
 */
export type TargetMethodReference = [ Constructor<any> | object, string | symbol ];
