import { DependenciesReflector } from "@aedart/reflections";

describe('@aedart/reflections', () => {

    describe('Dependencies Reflector', () => {

        it('can set and obtain list of dependencies for target', function () {

            // Aka. the target
            class MyComponent {}

            // A class of any kind that target depends on
            class ViewManager {}

            // Dependencies (e.g. identifiers... etc)
            let a = 'storage-service';
            let b = ViewManager;
            let c = Symbol('other-binding-identifier');
            let d = function() {};
            let dependencies = [a, b, c, d];

            // -------------------------------------------------------------- //

            const reflector = new DependenciesReflector();
            reflector.set(MyComponent, dependencies);

            // -------------------------------------------------------------- //

            expect(reflector.has(MyComponent))
                .withContext('No dependencies found for component!')
                .toBeTrue();

            let result = reflector.get(MyComponent);
            expect(result)
                .withContext('Incorrect list of dependencies returned')
                .toBe(dependencies);
        });

        it('returns empty list when no dependencies set for target', function () {
            class MyComponent {}

            const reflector = new DependenciesReflector();

            expect(reflector.get(MyComponent))
                .withContext('Should not have any dependencies set!')
                .toHaveSize(0);
        });
    });
});
