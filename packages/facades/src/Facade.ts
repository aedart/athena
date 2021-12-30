import Container, {
    BindingIdentifier,
    ConcreteInstance
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
     * @type {Map<BindingIdentifier, ConcreteInstance>}
     */
    protected static resolvedInstances: Map<BindingIdentifier, ConcreteInstance> = new Map<BindingIdentifier, ConcreteInstance>();

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
     * @return {ConcreteInstance}
     *
     * @throws {BindingException}
     */
    facadeRoot(): ConcreteInstance {
        return Facade.resolveFacadeInstance(this.facadeAccessor());
    }

    /**
     * Resolve the facade root from the IoC Service Container
     *
     * @param {BindingIdentifier} name
     *
     * @return {ConcreteInstance}
     *
     * @throws {BindingException}
     * @throws {TypeError} If IoC Service Container instance not defined in Facade
     */
    static resolveFacadeInstance(name: BindingIdentifier): ConcreteInstance {
        if (this.hasResolveInstance(name)) {
            return this.resolvedInstances.get(name);
        }

        if (!this.serviceContainer) {
            throw new TypeError('IoC Service Container instance not defined in Facade');
        }

        let resolved: ConcreteInstance = this.serviceContainer?.make(name);

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
    static hasResolveInstance(name: BindingIdentifier): boolean {
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
        let allowed: string[]|symbol[] = [
            'serviceContainer'
        ];

        return {
            set(target: Facade, p: string | symbol, value: any, receiver: any): boolean {
                // If requested property is in Facade class, allow setting it
                if (allowed.includes(p as never) && p in target) {
                    (target as any)[p] = value;
                    return true;
                }

                // Set value in facade's root instance
                let root: ConcreteInstance = target.facadeRoot();
                root[p] = value

                return true;
            },

            get(target: Facade, p: string | symbol, receiver: any): any {
                // If requested property is in Facade class, allow returning it
                if (allowed.includes(p as never) && p in target) {
                    return (target as any)[p];
                }

                // Get value from facade's root instance
                let root: ConcreteInstance = target.facadeRoot();
                return root[p];
            },

            has(target: Facade, p: string | symbol): boolean {
                // If requested property is in Facade class...
                if (allowed.includes(p as never) && p in target) {
                    return true;
                }

                // Determine if property is in facade's root instance
                let root: ConcreteInstance = target.facadeRoot();
                return p in root;
            }
        }
    }
}
