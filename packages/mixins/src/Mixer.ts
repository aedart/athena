import {
    AbstractOrConcreteConstructor
} from "@aedart/contracts/dist/support";
import MixerContract, {
    ClassDecorator
} from "@aedart/contracts/dist/mixins";

/**
 * Mixer
 *
 * @template T
 */
export default class Mixer<T extends AbstractOrConcreteConstructor<any>> implements MixerContract<T> {

    /**
     * The base class that is being extended
     *
     * @protected
     *
     * @type {T}
     */
    protected baseClass: T;

    /**
     * Mixer
     *
     * @param {T} baseClass
     */
    constructor(baseClass: T) {
        this.baseClass = baseClass;
    }

    /**
     * @inheritdoc
     */
    with(...mixins: (any)[]): any {
        return mixins.reduce((constructorFn: T, mixin: ClassDecorator) => {
            return typeof mixin !== 'function'
                ? constructorFn
                : mixin(constructorFn);
        }, this.baseClass);
    }
}
