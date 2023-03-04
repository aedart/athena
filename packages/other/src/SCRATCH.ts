import {
    Constructor,
    AbstractOrConcreteConstructor
} from "@aedart/contracts/dist/support";
// import {
//     ClassDecorator
// } from "@aedart/contracts/dist/mixins";
import mix, { decorate } from "@aedart/mixins";

/**
 * Aware of a name...
 */
interface NameAware {

    /**
     * Set the name
     *
     * @param name
     */
    set name(name: string);

    /**
     * Get the name
     */
    get name(): string;

    /**
     * Get the full name... whatever that is
     */
    fullName(): string;
}

/**
 * Aware of age...
 */
interface AgeAware {

    /**
     * Age of ...something?
     *
     * @return {number}
     */
    get age(): number;
}

/**
 * Recordable
 */
interface Recordable {

    /**
     * State whether something is recordable or not
     */
    get isRecordable(): boolean;
}

interface Player extends NameAware, Recordable {

}

// ----------------------------------------------------------------------------------------------------------------- //

//
// interface Builder<T extends AbstractOrConcreteConstructor<any>> {
//
//     with<M1 extends ClassDecorator<T>>(mixin: M1): T & ReturnType<M1>;
//
//     with<
//         M1 extends ClassDecorator<T>,
//         M2 extends ClassDecorator<T>,
//         >(
//         mixin1: M1,
//         mixin2: M2,
//     ):
//         T
//         & ReturnType<M1>
//         & ReturnType<M2>
//     ;
//
//     with<
//         M1 extends ClassDecorator<T>,
//         M2 extends ClassDecorator<T>,
//         M3 extends ClassDecorator<T>,
//         >(
//         mixin1: M1,
//         mixin2: M2,
//         mixin3: M3,
//     ):
//         T
//         & ReturnType<M1>
//         & ReturnType<M2>
//         & ReturnType<M3>
//     ;
//
//     with(...mixins: any[]): any;
// }
//
// class Builder<T extends AbstractOrConcreteConstructor<any>> implements Builder<T>{
//
//     protected baseClass: T;
//
//     constructor(baseClass: T) {
//         this.baseClass = baseClass;
//     }
//
//     // Return type ONLY functions when a single argument is given!!!
//     // with<U extends ClassDecorator<T>>(...mixins: U[]): T & ReturnType<U> {
//     //     // Well... despite best efforts, the following code
//     //     // is understood by most IDEs as returning the baseClass (type T).
//     //     // Thus, we need to ignore it...
//     //     // @ts-ignore
//     //     return mixins.reduce((constructorFn: T, mixin: U) => {
//     //         return typeof mixin !== 'function'
//     //             ? constructorFn
//     //             : mixin(constructorFn);
//     //     }, this.baseClass);
//     // }
//
//     with<U extends ClassDecorator<T>>(...mixins: U[]) {
//
//         // Well... despite best efforts, the following code
//         // is understood by most IDEs as returning the baseClass (type T).
//         // Thus, we need to ignore it...
//         // @ts-ignore
//         return mixins.reduce((constructorFn: T, mixin: U) => {
//             return typeof mixin !== 'function'
//                 ? constructorFn
//                 : mixin(constructorFn);
//         }, this.baseClass);
//     }
// }

// function mix<T extends AbstractOrConcreteConstructor<any>>(baseClass: T) {
//     return new Builder<T>(baseClass);
// }

// ----------------------------------------------------------------------------------------------------------------- //

function NameMixin<T extends AbstractOrConcreteConstructor<any>, U extends NameAware>(superClass: T): Constructor<U> {
    return (class extends superClass implements NameAware {
        _name: string = 'Rick';

        set name(name: string) {
            this._name = name;
        }

        get name(): string {
            return this._name;
        }

        fullName(): string {
            return "My full name";
        }
    } as Constructor<U>);
}

const ttt = NameMixin(class { fish: string = 'of some kind...' });
let zzz = new ttt();

// @ts-ignore
console.log('ZZZ', zzz.fish, zzz.fullName()); // fish is unknown here... but we can live with that

function AgeMixin<T extends AbstractOrConcreteConstructor<any>, U extends AgeAware>(superClass: T): Constructor<U> {
    return (class extends superClass implements AgeAware {

        get age(): number {
            return 24;
        }

    } as Constructor<U>);
}

// const two: Constructor<NameAware> & Constructor<AgeAware> = NameMixin(AgeMixin(class { alpha: boolean = false }));
// const vvv = new two();

// function declare<T>(mixin: Function): Constructor<T> {
//     return mixin as Constructor<T>;
// }

// const RecordableMixin: ClassDecorator<Recordable> = declare<Recordable>((superClass: Ctor) => class extends superClass implements Recordable {
//     get isRecordable(): boolean {
//         return true;
//     }
// });

function RecordableMixin<U extends Recordable>(superClass: AbstractOrConcreteConstructor<any>) {
    return decorate<U>(class extends superClass implements Recordable {
            get isRecordable(): boolean {
                return false;
            }
    });
}

// ----------------------------------------------------------------------------------------------------------------- //

abstract class BasePerson {
    /**
     * Stuff...
     */
    public something: string = 'something';
    public weeee: number = 1234;
}

/*class Person extends NameMixin(BasePerson) implements Player {

}*/

class Person extends mix(BasePerson).with(
    NameMixin,
    AgeMixin,
    RecordableMixin
) implements Player {
    constructor() {
        super();

        this.name = 'Sweet';
    }
}


let player = new Person();

console.log(player.name);
console.log(player.something);
console.log(player.age);
console.log(player.isRecordable);

player.name = 'Smith';

console.log(player.name);
console.log('- - '.repeat(20));
