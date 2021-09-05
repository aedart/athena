import { ClassReference } from "@aedart/contracts/dist/container";

/**
 * Class method reference, in the form of an array with
 * fixed elements.
 *
 * THe first element is the target class reference or object.
 * The second element the method to be invoked in the target
 */
export type TargetMethodReference = [ ClassReference<any> | object, string | symbol ];
