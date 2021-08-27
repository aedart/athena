import {
    DependenciesReflector as DependenciesReflectorContract,
    DependenciesList
} from "@aedart/contracts/dist/reflections";
import Meta from "@aedart/meta";

/**
 * Meta Type
 *
 * @see {MetaType}
 */
export const DEPENDENCIES_META_TYPE = Symbol('dependencies');

/**
 * Dependencies Reflector
 *
 * @see {DependenciesReflectorContract}
 */
export default class DependenciesReflector implements DependenciesReflectorContract {

    /**
     * Set meta information about target's dependencies
     *
     * @param {object} target
     * @param {DependenciesList} dependencies A list of dependencies that target requires
     *
     * @return {DependenciesReflector}
     */
    set(target: object, dependencies: DependenciesList): DependenciesReflector {
        Meta.getInstance().set(target, dependencies, DEPENDENCIES_META_TYPE);

        return this;
    }

    /**
     * Get meta information about target's dependencies
     *
     * @param {object} target
     *
     * @return {DependenciesList} Empty when none available
     */
    get(target: object): DependenciesList {
        if (!this.has(target)) {
            return [];
        }

        return Meta.getInstance().get(target, DEPENDENCIES_META_TYPE);
    }

    /**
     * Determine if meta information about target's
     * dependencies exist
     *
     * @param {object} target
     *
     * @return {boolean}
     */
    has(target: object): boolean {
        return Meta.getInstance().has(target, DEPENDENCIES_META_TYPE);
    }
}
