import {
    Binding,
    InvalidBindingIdentifier,
    InvalidBindingValue
} from "@aedart/container";

describe('@aedart/container', () => {

    describe('Binding Entry', () => {

        it('can create binding entry instance', function () {

            let id = Symbol('my-identifier');
            let value = (container, ...params) => { return false };
            let shared = false;

            const binding = new Binding(id, value, shared);

            expect(binding.abstract).toBe(id);
            expect(binding.value).toBe(value);
            expect(binding.shared).toBe(shared);
        });

        it('can create binding entry with factory callback', function () {

            let id = Symbol('other-identifier');
            let value = (container, ...params) => { return false };

            const binding = new Binding(id, value);

            expect(binding.isFactoryCallback)
                .withContext('Should be a factory callback')
                .toBeTrue();

            expect(binding.isClassReference)
                .withContext('Should not be a class reference')
                .toBeFalse();
        });

        it('can create binding entry with class reference', function () {

            let id = Symbol('another-identifier');
            let value = class {};

            const binding = new Binding(id, value);

            expect(binding.isFactoryCallback)
                .withContext('Should NOT be a factory callback')
                .toBeFalse();

            expect(binding.isClassReference)
                .withContext('Should be a class reference')
                .toBeTrue();
        });

        it('fails when binding identifier is invalid', function () {
            const whenNull = () => {
                new Binding(null, () => {})
            };

            const whenInvalid = () => {
                new Binding(undefined, () => {})
            };

            expect(whenNull)
                .toThrowError(InvalidBindingIdentifier);

            expect(whenInvalid)
                .toThrowError(InvalidBindingIdentifier);
        });

        it('fails when binding value is invalid', function () {
            const whenNull = () => {
                new Binding(Symbol('a'), null)
            };

            const whenInvalid = () => {
                new Binding(Symbol('b'), [ 'a', 'b', 'c' ])
            };

            expect(whenNull)
                .toThrowError(InvalidBindingValue);

            expect(whenInvalid)
                .toThrowError(InvalidBindingValue);
        });
    });

});
