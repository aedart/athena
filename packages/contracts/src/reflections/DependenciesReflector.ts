import { DependenciesList } from "./aliases";

/**
 * Dependencies Reflector
 *
 * Able to specify and obtain meta information about a target's
 * dependencies.
 */
export default interface DependenciesReflector {

    /**
     * Set meta information about target's dependencies
     *
     * @param target
     * @param dependencies A list of dependencies that target requires
     */
    set(target: object, dependencies: DependenciesList): DependenciesReflector;

    /**
     * Get meta information about target's dependencies
     *
     * @param target
     */
    get(target: object): DependenciesList;

    /**
     * Determine if meta information about target's
     * dependencies exist
     *
     * @param target
     */
    has(target: object): boolean;
}
