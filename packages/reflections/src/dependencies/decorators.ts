import { DependenciesList } from "@aedart/contracts/dist/reflections";
import DependenciesReflector from "./DependenciesReflector";

/**
 * Defines meta information about a class' dependencies.
 *
 * **Note**: This method is intended to be used as class decorator!
 *
 * Example:
 * <pre>
 *     @classDependsOn(MyStorageService, MyViewComponent, 'my-dependency-identifier')
 *     class MyController {
 *         // ... remaining not shown...
 *     }
 * </pre>
 *
 * @see DependenciesReflector
 * @see {@link https://babeljs.io/docs/en/babel-plugin-proposal-decorators|Babel Decorators}
 * @see {@link https://www.typescriptlang.org/docs/handbook/decorators.html#decorators|TypeScript Decorators}
 * @see {@link https://github.com/tc39/proposal-decorators|ECMAScript Decorators}
 *
 * @param {...BindingIdentifier | ConcreteInstance} params
 *
 * @return {Function}
 */
export function classDependsOn(...params: DependenciesList): Function {
    return (target: object) => {
        (new DependenciesReflector()).set(target, params);
    }
}

/**
 * Defines meta information about a class method's dependencies.
 *
 * **Note**: This method is intended to be used as a decorator for a class method!
 *
 * Example:
 * <pre>
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
 * @param {...BindingIdentifier | ConcreteInstance} params
 *
 * @return {Function}
 */
export function dependsOn(...params: DependenciesList): Function {
    return (target: object, key: string, descriptor: any) => {
        let method: Function = descriptor.value;

        (new DependenciesReflector()).set(method, params);
    }
}
