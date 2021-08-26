import Meta from "@aedart/meta";

/**
 * NOTE: TypeScript's decorator is similar to Babel's legacy
 * decorator!
 */
describe('@aedart/meta', () => {

    it('can use class decorator to store meta', function () {
        let meta = Meta.getInstance();

        let classDecorator = function(data) {
            return (target) => {
                Meta.getInstance().set(target, data);
                return target;
            }
        };

        let data = { a: true, b: false, c: 'sweet'};

        // ------------------------------------------------ //

        @classDecorator(data)
        class Service {}

        // ------------------------------------------------ //

        expect(meta.has(Service))
            .withContext('No meta stored for class')
            .toBeTrue();

        expect(meta.get(Service))
            .withContext('Incorrect meta obtained for target')
            .toBe(data)
    });

    it('can use method decorator to store meta', function () {
        let meta = Meta.getInstance();

        let methodDecorator = function(data) {
            return (target, key, descriptor) => {
                // NOTE: target = class reference!
                let method = descriptor.value;

                Meta.getInstance().set(method, data);
            }
        };

        let data = 'The cannon drinks with death, loot the pacific ocean before it screams.';

        // ------------------------------------------------ //

        class Person {

            @methodDecorator(data)
            isReady() {
                return true;
            }

        }

        // ------------------------------------------------ //
        let method = Person.prototype.isReady;
        //let method = (new Person()).isReady; // Also works!

        expect(meta.has(method))
            .withContext('No meta stored for method')
            .toBeTrue();

        expect(meta.get(method))
            .withContext('Incorrect meta obtained for method')
            .toBe(data)
    });
});
