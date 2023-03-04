import { decorate } from "@aedart/mixins";
import {
    Constructor,
    AbstractOrConcreteConstructor
} from "@aedart/contracts/dist/support";
import NameAware from "../contracts/NameAware";

/**
 * Name Mixin
 *
 * @mixin
 *
 * @implements NameAware
 */
export default function NameMixin<T extends NameAware>(superClass: AbstractOrConcreteConstructor<any>): Constructor<T> {
    return decorate<T>(class extends superClass implements NameAware {

        protected _name: string | undefined;

        set name(name: string) {
            this._name = name;
        }

        get name(): string {
            if (!this._name) {
                this.name = this.defaultName();
            }

            return (this._name as string);
        }

        defaultName(): string {
            return 'Ricky'
        }
    });
}

// export default decorate<NameAware>((superClass: AbstractOrConcreteConstructor<any>) => class NameMixin extends superClass implements NameAware{
//
//     protected _name: string | undefined;
//
//     set name(name: string) {
//         this._name = name;
//     }
//
//     get name(): string {
//         if (!this._name) {
//             this.name = this.defaultName();
//         }
//
//         return (this._name as string);
//     }
//
//     defaultName(): string {
//         return 'Ricky'
//     }
// }) as Constructor<NameAware>;
