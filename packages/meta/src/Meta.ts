import MetaContract, {
    MetaType,
    DEFAULT_TYPE
} from "@aedart/contracts/dist/meta";

/**
 * Internal map entry type
 */
type Entry = Map<MetaType, any>;

/**
 * Meta Store
 *
 * @see {MetaContract}
 */
export default class Meta implements MetaContract {

    /**
     * Meta Store singleton instance
     *
     * @protected
     */
    protected static instance: MetaContract | null = null;

    /**
     * Weak Map that contains maps of arbitrary data
     * for a target
     *
     * @protected
     */
    protected map: WeakMap<object, Entry>;

    /**
     * Meta
     */
    constructor() {
        this.map = new WeakMap<object, Entry>();
    }

    /**
     * Get the singleton instance of the Meta Store
     *
     * @return {MetaContract}
     */
    static getInstance(): MetaContract {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }

    /**
     * Set arbitrary data for target
     *
     * @param {object} target
     * @param {any} data
     * @param {MetaType} [type] Optional meta type, e.g. a tag or category
     *
     * @return {MetaContract}
     */
    set(target: object, data: any, type: MetaType = DEFAULT_TYPE): MetaContract {
        let entry: Entry | undefined = this.map.get(target);

        // Create new entry, if none exists
        if (!entry) {
            entry = new Map<MetaType, any>();
        }

        // Set data for given type
        entry.set(type, data);

        // (Re)set the entry for given target
        this.map.set(target, entry);

        return this;
    }

    /**
     * Get arbitrary data for target
     *
     * @param {object} target
     * @param {MetaType} [type] Optional meta type, e.g. a tag or category
     *
     * @return {any|undefined} Undefined if no arbitrary data exists for given target and type
     */
    get(target: object, type: MetaType = DEFAULT_TYPE): any | undefined {
        let entry: Entry | undefined = this.map.get(target);

        if (!entry) {
            return undefined;
        }

        return entry.get(type);
    }

    /**
     * Determine if target has arbitrary data
     *
     * @param {object} target
     * @param {MetaType} [type] Optional meta type, e.g. a tag or category
     *
     * @return {boolean}
     */
    has(target: object, type: MetaType = DEFAULT_TYPE): boolean {
        let entry: Entry | undefined = this.map.get(target);

        if (!entry) {
            return false;
        }

        return entry.has(type);
    }

    /**
     * Delete arbitrary data for target
     *
     * @param {object} target
     * @param {MetaType} [type] Optional meta type, e.g. a tag or category
     *
     * @return {boolean}
     */
    forget(target: object, type: MetaType = DEFAULT_TYPE): boolean {
        let entry: Entry | undefined = this.map.get(target);

        if (!entry) {
            return false;
        }

        return entry.delete(type);
    }

    /**
     * Delete all arbitrary data for target
     *
     * @param {object} target
     *
     * @return {boolean}
     */
    forgetAll(target: object): boolean {
        return this.map.delete(target);
    }
}
