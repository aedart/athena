import { MetaType } from "./aliases";

/**
 * The default meta type to be used, when no type
 * has been given
 */
export const DEFAULT_TYPE: unique symbol = Symbol('default_meta_type');

/**
 * Meta Store identifier
 */
export const META: unique symbol = Symbol('@aedart/contracts/meta');

/**
 * Meta Store
 *
 * Able to store arbitrary data about a target
 */
export default interface Meta {

    /**
     * Set arbitrary data for target
     *
     * @param target
     * @param data
     * @param type Optional meta type, e.g. a tag or category
     */
    set(target: object, data: any, type?: MetaType): Meta;

    /**
     * Get arbitrary data for target
     *
     * @param target
     * @param type Optional meta type, e.g. a tag or category
     */
    get(target: object, type?: MetaType): any | undefined;

    /**
     * Determine if target has arbitrary data
     *
     * @param target
     * @param type Optional meta type, e.g. a tag or category
     */
    has(target: object, type?: MetaType): boolean;

    /**
     * Delete arbitrary data for target
     *
     * @param target
     * @param type Optional meta type, e.g. a tag or category
     */
    forget(target: object, type?: MetaType): boolean;

    /**
     * Delete all arbitrary data for target
     *
     * @param target
     */
    forgetAll(target: object): boolean;
}
