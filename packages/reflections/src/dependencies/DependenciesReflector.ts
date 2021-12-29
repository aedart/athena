import {
    DependenciesReflector as DependenciesReflectorContract,
    DependenciesList
} from "@aedart/contracts/dist/reflections";
import Meta from "@aedart/meta";

/**
 * Meta Type to be used for storing meta information
 * about a target's dependencies
 *
 * @see MetaType
 */
export const DEPENDENCIES_META_TYPE = Symbol('dependencies');

/**
 * Dependencies Reflector
 *
 * @see DependenciesReflectorContract
 */
export default class DependenciesReflector implements DependenciesReflectorContract {

    /**
     * The current singleton dependencies reflector instance
     *
     * @protected
     *
     * @type {DependenciesReflectorContract|null}
     */
    protected static instance: DependenciesReflectorContract | null = null;

    /**
     * Get singleton instance of the dependencies reflector
     *
     * @return {DependenciesReflectorContract}
     */
    static getInstance(): DependenciesReflectorContract {
        if (this.instance === null || this.instance === undefined) {
            this.setInstance(new this());
        }

        // @ts-ignore
        return this.instance;
    }

    /**
     * Set the singleton instance of the dependencies reflector
     *
     * @param {DependenciesReflectorContract|null} [dependenciesReflector]
     *
     * @return {DependenciesReflectorContract|null}
     */
    static setInstance(dependenciesReflector: DependenciesReflectorContract | null = null): DependenciesReflectorContract | null {
        this.instance = dependenciesReflector;

        return this.instance;
    }

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
