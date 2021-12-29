import { DependenciesList } from "@aedart/contracts/dist/reflections";
import DependenciesReflector from "./DependenciesReflector";

/**
 * Defines dependencies meta information for a class or a class' method
 *
 * **Note**: This method is intended to be used as a decorator!
 *
 * Example:
 * <pre>
 *     @dependsOn(MyStorageService, MyViewComponent, 'my-dependency-identifier')
 *     class MyController {
 *
 *          @dependsOn(MyIndexRequest, 'my-user-dependency-identifier')
 *          index(request, user) {
 *              // ...remaining not shown...
 *          }
 *     }
 * </pre>
 *
 * @see DependenciesReflector
 * @see {@link https://babeljs.io/docs/en/babel-plugin-proposal-decorators|Babel Decorators}
 * @see {@link https://www.typescriptlang.org/docs/handbook/decorators.html#decorators|TypeScript Decorators}
 * @see {@link https://github.com/tc39/proposal-decorators|ECMAScript Decorators}
 *
 * @param {...BindingIdentifier} params
 *
 * @return {Function}
 */
export function dependsOn(...params: DependenciesList): Function {
    return (target: object, key?: string, descriptor?: any) => {
        let reflectorTarget: object | Function = target;

        // In case that a class method is being decorated, then
        // the "descriptor" should be set. If that's the case,
        // we change the reflector's target to match the method.
        if (descriptor && descriptor.hasOwnProperty('value')) {
            reflectorTarget = descriptor.value;
        }

        // Finally, set the dependencies meta information for the target
        DependenciesReflector
            .getInstance()
            .set(reflectorTarget, params);
    }
}
