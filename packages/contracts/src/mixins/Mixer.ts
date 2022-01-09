import {
    AbstractOrConcreteConstructor
} from "@aedart/contracts/dist/support";
import { ClassDecorator } from "./aliases";

/**
 * Mixer
 *
 * Able to mixin one or more decorators with a base class
 */
export default interface Mixer<T extends AbstractOrConcreteConstructor<any>> {

    /**
     * Mixes decorators class into the base class
     *
     * @param mixin
     */
    with<M1 extends ClassDecorator<T>>(mixin: M1): T & ReturnType<M1>;

    /**
     * Mixes decorators classes into the base class
     *
     * @param mixin1
     * @param mixin2
     */
    with<
        M1 extends ClassDecorator<T>,
        M2 extends ClassDecorator<T>,
    >(
        mixin1: M1,
        mixin2: M2,
    ):
        T
        & ReturnType<M1>
        & ReturnType<M2>
    ;

    /**
     * Mixes decorators classes into the base class
     *
     * @param mixin1
     * @param mixin2
     * @param mixin3
     */
    with<
        M1 extends ClassDecorator<T>,
        M2 extends ClassDecorator<T>,
        M3 extends ClassDecorator<T>,
    >(
        mixin1: M1,
        mixin2: M2,
        mixin3: M3,
    ):
        T
        & ReturnType<M1>
        & ReturnType<M2>
        & ReturnType<M3>
    ;

    /**
     * Mixes decorators classes into the base class
     *
     * @param mixin1
     * @param mixin2
     * @param mixin3
     * @param mixin4
     */
    with<
        M1 extends ClassDecorator<T>,
        M2 extends ClassDecorator<T>,
        M3 extends ClassDecorator<T>,
        M4 extends ClassDecorator<T>,
    >(
        mixin1: M1,
        mixin2: M2,
        mixin3: M3,
        mixin4: M4,
    ):
        T
        & ReturnType<M1>
        & ReturnType<M2>
        & ReturnType<M3>
        & ReturnType<M4>
    ;

    /**
     * Mixes decorators classes into the base class
     *
     * @param mixin1
     * @param mixin2
     * @param mixin3
     * @param mixin4
     * @param mixin5
     */
    with<
        M1 extends ClassDecorator<T>,
        M2 extends ClassDecorator<T>,
        M3 extends ClassDecorator<T>,
        M4 extends ClassDecorator<T>,
        M5 extends ClassDecorator<T>,
    >(
        mixin1: M1,
        mixin2: M2,
        mixin3: M3,
        mixin4: M4,
        mixin5: M5,
    ):
        T
        & ReturnType<M1>
        & ReturnType<M2>
        & ReturnType<M3>
        & ReturnType<M4>
        & ReturnType<M5>
    ;

    /**
     * Mixes decorators classes into the base class
     *
     * @param mixin1
     * @param mixin2
     * @param mixin3
     * @param mixin4
     * @param mixin5
     * @param mixin6
     */
    with<
        M1 extends ClassDecorator<T>,
        M2 extends ClassDecorator<T>,
        M3 extends ClassDecorator<T>,
        M4 extends ClassDecorator<T>,
        M5 extends ClassDecorator<T>,
        M6 extends ClassDecorator<T>,
    >(
        mixin1: M1,
        mixin2: M2,
        mixin3: M3,
        mixin4: M4,
        mixin5: M5,
        mixin6: M6,
    ):
        T
        & ReturnType<M1>
        & ReturnType<M2>
        & ReturnType<M3>
        & ReturnType<M4>
        & ReturnType<M5>
        & ReturnType<M6>
    ;

    /**
     * Mixes decorators classes into the base class
     *
     * @param mixin1
     * @param mixin2
     * @param mixin3
     * @param mixin4
     * @param mixin5
     * @param mixin6
     * @param mixin7
     */
    with<
        M1 extends ClassDecorator<T>,
        M2 extends ClassDecorator<T>,
        M3 extends ClassDecorator<T>,
        M4 extends ClassDecorator<T>,
        M5 extends ClassDecorator<T>,
        M6 extends ClassDecorator<T>,
        M7 extends ClassDecorator<T>,
    >(
        mixin1: M1,
        mixin2: M2,
        mixin3: M3,
        mixin4: M4,
        mixin5: M5,
        mixin6: M6,
        mixin7: M7,
    ):
        T
        & ReturnType<M1>
        & ReturnType<M2>
        & ReturnType<M3>
        & ReturnType<M4>
        & ReturnType<M5>
        & ReturnType<M6>
        & ReturnType<M7>
    ;

    /**
     * Mixes decorators classes into the base class
     *
     * @param mixin1
     * @param mixin2
     * @param mixin3
     * @param mixin4
     * @param mixin5
     * @param mixin6
     * @param mixin7
     * @param mixin8
     */
    with<
        M1 extends ClassDecorator<T>,
        M2 extends ClassDecorator<T>,
        M3 extends ClassDecorator<T>,
        M4 extends ClassDecorator<T>,
        M5 extends ClassDecorator<T>,
        M6 extends ClassDecorator<T>,
        M7 extends ClassDecorator<T>,
        M8 extends ClassDecorator<T>,
    >(
        mixin1: M1,
        mixin2: M2,
        mixin3: M3,
        mixin4: M4,
        mixin5: M5,
        mixin6: M6,
        mixin7: M7,
        mixin8: M8,
    ):
        T
        & ReturnType<M1>
        & ReturnType<M2>
        & ReturnType<M3>
        & ReturnType<M4>
        & ReturnType<M5>
        & ReturnType<M6>
        & ReturnType<M7>
        & ReturnType<M8>
    ;

    /**
     * Mixes decorators classes into the base class
     *
     * @param mixin1
     * @param mixin2
     * @param mixin3
     * @param mixin4
     * @param mixin5
     * @param mixin6
     * @param mixin7
     * @param mixin8
     * @param mixin9
     */
    with<
        M1 extends ClassDecorator<T>,
        M2 extends ClassDecorator<T>,
        M3 extends ClassDecorator<T>,
        M4 extends ClassDecorator<T>,
        M5 extends ClassDecorator<T>,
        M6 extends ClassDecorator<T>,
        M7 extends ClassDecorator<T>,
        M8 extends ClassDecorator<T>,
        M9 extends ClassDecorator<T>,
    >(
        mixin1: M1,
        mixin2: M2,
        mixin3: M3,
        mixin4: M4,
        mixin5: M5,
        mixin6: M6,
        mixin7: M7,
        mixin8: M8,
        mixin9: M9,
    ):
        T
        & ReturnType<M1>
        & ReturnType<M2>
        & ReturnType<M3>
        & ReturnType<M4>
        & ReturnType<M5>
        & ReturnType<M6>
        & ReturnType<M7>
        & ReturnType<M8>
        & ReturnType<M9>
    ;

    /**
     * Mixes decorators classes into the base class
     *
     * @param mixin1
     * @param mixin2
     * @param mixin3
     * @param mixin4
     * @param mixin5
     * @param mixin6
     * @param mixin7
     * @param mixin8
     * @param mixin9
     * @param mixin10
     */
    with<
        M1 extends ClassDecorator<T>,
        M2 extends ClassDecorator<T>,
        M3 extends ClassDecorator<T>,
        M4 extends ClassDecorator<T>,
        M5 extends ClassDecorator<T>,
        M6 extends ClassDecorator<T>,
        M7 extends ClassDecorator<T>,
        M8 extends ClassDecorator<T>,
        M9 extends ClassDecorator<T>,
        M10 extends ClassDecorator<T>,
    >(
        mixin1: M1,
        mixin2: M2,
        mixin3: M3,
        mixin4: M4,
        mixin5: M5,
        mixin6: M6,
        mixin7: M7,
        mixin8: M8,
        mixin9: M9,
        mixin10: M10,
    ):
        T
        & ReturnType<M1>
        & ReturnType<M2>
        & ReturnType<M3>
        & ReturnType<M4>
        & ReturnType<M5>
        & ReturnType<M6>
        & ReturnType<M7>
        & ReturnType<M8>
        & ReturnType<M9>
        & ReturnType<M10>
    ;

    /**
     * Mixes decorators classes into the base class
     *
     * @param {...any} mixins
     */
    with(...mixins: any[]): any;
}
