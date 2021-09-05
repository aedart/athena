import {Reference} from "@aedart/support";
import { __INVOKE } from "@aedart/contracts/dist/support";

describe('@aedart/support', () => {

    describe('Class Method Reference', () => {

        it('can create reference with default method', function () {
            let target = class {};

            const ref = Reference.make(target);

            expect(ref.target)
                .withContext('Incorrect target')
                .toBe(target);

            expect(ref.method)
                .withContext('Incorrect method')
                .toBe(__INVOKE)
        });

        it('can create reference with method', function () {
            let target = class {};
            let method = 'doSomething';

            const ref = Reference.make(target, method);

            expect(ref.method)
                .withContext('Incorrect method')
                .toBe(method)
        });

        it('can create reference with parameters', function () {
            let target = class {};
            let method = 'handle';

            const a = 'a';
            const b = true;
            const c = () => {};

            const ref = Reference.make(target, method)
                .with(a, b, c);

            expect(ref.hasParameters)
                .withContext('No parameters in reference')
                .toBeTrue();

            expect(ref.parameters)
                .withContext('Incorrect amount of parameters')
                .toHaveSize(3)

            // ----------------------------------------------------- //

            expect(ref.parameters[0])
                .withContext('Param A is incorrect')
                .toBe(a);

            expect(ref.parameters[1])
                .withContext('Param B is incorrect')
                .toBe(b);

            expect(ref.parameters[2])
                .withContext('Param C is incorrect')
                .toBe(c);
        });

        it('can create reference to object', function () {
            let service = class {}
            let target = new service();
            let method = 'handle';


            const ref = Reference.make(target, method);

            expect(ref.target)
                .withContext('Incorrect target object')
                .toBe(target);
        });

        it('can create from array (target method reference tuple)', function () {
            let target = class {};
            let method = 'handle';

            const ref = Reference.fromArray([target, method])

            expect(ref.target)
                .withContext('Incorrect target')
                .toBe(target);

            expect(ref.method)
                .withContext('Incorrect method')
                .toBe(method)
        });
    });

});
