import Container, {
    BindingIdentifier,
    Resolved
} from "@aedart/contracts/dist/container";

/**
 * Facade
 *
 * Abstraction is heavily inspired by Taylor Otwell's "Facade" implementation in Laravel.
 * @see https://laravel.com/docs/8.x/facades
 *
 * @abstract
 */
export default abstract class Facade {

    /**
     * The IoC Service Container that facades must use
     *
     * @protected
     *
     * @type {Container|null}
     */
    protected static container: Container | null = null;

    /**
     * Resolved instances
     *
     * @protected
     *
     * @type {Map<BindingIdentifier, Resolved<any>>}
     */
    protected static resolvedInstances: Map<BindingIdentifier, Resolved<any>> = new Map<BindingIdentifier, Resolved>();

    /**
     * Facade
     *
     * @return {Proxy<Facade>}
     *
     * @throws {Error} If attempting to initialise abstract Facade
     * @throws {TypeError} If facade accessor is missing
     * @throws {BindingException} If unable to resolve facade accessor from IoC Service Container
     */
    constructor() {
        if (new.target === Facade) {
            throw new Error('Cannot create instance of abstract class');
        }

        let accessor = this.facadeAccessor();
        if (!accessor) {
            throw new TypeError('A facade accessor was expected, but was not defined in ' + new.target.name);
        }

        return new Proxy<Facade>(this, Facade.makeFacadeProxyHandler());
    }

    /**
     * Get the binding identifier (accessor) for the facade root
     */
    abstract facadeAccessor(): BindingIdentifier;

    /**
     * Get the "root" instance - the resolved instance
     * from the IoC Service Container
     *
     * @return {Resolved}
     *
     * @throws {BindingException}
     */
    facadeRoot(): Resolved {
        return Facade.resolveFacadeInstance(this.facadeAccessor());
    }

    /**
     * Resolve the facade root from the IoC Service Container
     *
     * @param {BindingIdentifier} name
     *
     * @return {Resolved}
     *
     * @throws {BindingException}
     * @throws {TypeError} If IoC Service Container instance not defined in Facade
     */
    static resolveFacadeInstance(name: BindingIdentifier): Resolved {
        if (this.hasResolvedInstance(name)) {
            return this.resolvedInstances.get(name);
        }

        if (!this.serviceContainer) {
            throw new TypeError('IoC Service Container instance not defined in Facade');
        }

        let resolved: Resolved = this.serviceContainer?.make(name);

        this.resolvedInstances.set(name, resolved);

        return resolved;
    }

    /**
     * Determine if instance has been resolved for given identifier
     *
     * @param {BindingIdentifier} name
     *
     * @return {boolean}
     */
    static hasResolvedInstance(name: BindingIdentifier): boolean {
        return this.resolvedInstances.has(name);
    }

    /**
     * Clear resolved instance for given identifier
     *
     * @param {BindingIdentifier} name
     *
     * @return {boolean}
     */
    static clearResolvedInstance(name: BindingIdentifier): boolean {
        return this.resolvedInstances.delete(name);
    }

    /**
     * Clear all resolved instances
     */
    static clearResolvedInstances() {
        this.resolvedInstances.clear();
    }

    /**
     * Set the IoC Service Container instance facades must use
     *
     * @param {Container|null} container
     */
    static set serviceContainer(container: Container | null) {
        this.container = container;
    }

    /**
     * Get the IoC Service Container instance that facades must
     * use - if any was set
     *
     * @return {Container|null}
     */
    static get serviceContainer(): Container | null {
        return this.container;
    }

    /**
     * Creates a proxy handler for the facade
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy
     *
     * @protected
     *
     * @return {ProxyHandler<Facade>}
     */
    static makeFacadeProxyHandler(): ProxyHandler<Facade> {

        let facadeMembers: string[] | symbol[] = [
            'facadeAccessor',
            'facadeRoot'
        ];

        return {
            set(target: Facade, p: string | symbol, value: any, receiver: any): boolean {
                let root: Resolved = target.facadeRoot();
                if (p in root && !facadeMembers.includes(p as never)) {
                    root[p] = value
                    return true;
                }

                (target as any)[p] = value;
                return true;
            },

            get(target: Facade, p: string | symbol, receiver: any): any {
                let root: Resolved = target.facadeRoot();
                if (p in root && !facadeMembers.includes(p as never)) {
                    return root[p];
                }

                return (target as any)[p];
            },

            has(target: Facade, p: string | symbol): boolean {
                let root: Resolved = target.facadeRoot();
                if (p in root && !facadeMembers.includes(p as never)) {
                    return true;
                }

                return p in target;
            },

            deleteProperty(target: Facade, p: string | symbol): boolean {
                let root: Resolved = target.facadeRoot();

                // If the property exists inside the facade's root, attempt to
                // delete it. Note that this might fail, if the property is not
                // "configurable". However, we allow JavaScript to simply fail so
                // the developer has a chance to act on it...
                if (p in root && !facadeMembers.includes(p as never)) {
                    delete root[p];
                    return true;
                }

                return false;
            },

            defineProperty(target: Facade, p: string | symbol, attributes: PropertyDescriptor): boolean {
                let root: Resolved = target.facadeRoot();

                Object.defineProperty(root, p, attributes);

                return true;
            },

            getOwnPropertyDescriptor(target: Facade, p: string | symbol): PropertyDescriptor | undefined {
                let root: Resolved = target.facadeRoot();
                if (p in root && !facadeMembers.includes(p as never)) {
                    return Reflect.getOwnPropertyDescriptor(root, p);
                }

                return Reflect.getOwnPropertyDescriptor(target, p);
            },

            ownKeys(target: Facade): ArrayLike<string | symbol> {
                let root: Resolved = target.facadeRoot();

                return Reflect.ownKeys(root);
            }
        }
    }
}
