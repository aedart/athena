import {
    dependsOn,
    DependenciesReflector
} from "@aedart/reflections";

describe('@aedart/reflections', () => {

    describe('Dependencies Decorators', () => {

        it('can set and obtain class dependencies', function () {

            // Some dependencies - identifiers, references... etc
            class Manager {}
            let a = 'cache-service';
            let b = Manager;
            let c = Symbol('my-binding-identifier');
            let d = function() {};
            let originalDependencies = [a, b, c, d];

            // The decorated target
            @dependsOn(a, b, c, d)
            class MyService {}

            // ------------------------------------------------------- //

            const reflector = new DependenciesReflector();

            expect(reflector.has(MyService))
                .withContext('No dependencies meta info. set for target')
                .toBeTrue();

            let dependencies = reflector.get(MyService);
            expect(dependencies)
                .withContext('Incorrect amount of dependencies returned')
                .toHaveSize(originalDependencies.length)

            // ------------------------------------------------------- //

            for (let i = 0; i < dependencies.length; i++) {
                let dependency = dependencies[i];
                let original = originalDependencies[i];

                // Debug
                // console.log(dependency, original);

                expect(dependency)
                    .withContext(`Incorrect dependency at index ${i}`)
                    .toBe(original);
            }
        });

        it('can set and obtain method dependencies', function () {

            // Some dependencies - identifiers, references... etc
            class OtherService {}
            let a = 'api-service';
            let b = OtherService;
            let c = Symbol('other-binding-identifier');
            let d = () => {};
            let originalDependencies = [a, b, c, d];

            // The decorated target
            class Task {

                @dependsOn(a, b, c, d)
                write(otherService) {
                    // ... n/a
                }
            }

            // ------------------------------------------------------- //

            const reflector = new DependenciesReflector();
            const target = Task.prototype.write;

            expect(reflector.has(target))
                .withContext('No dependencies meta info. set for target')
                .toBeTrue();

            let dependencies = reflector.get(target);
            expect(dependencies)
                .withContext('Incorrect amount of dependencies returned')
                .toHaveSize(originalDependencies.length)

            // ------------------------------------------------------- //

            for (let i = 0; i < dependencies.length; i++) {
                let dependency = dependencies[i];
                let original = originalDependencies[i];

                // Debug
                // console.log(dependency, original);

                expect(dependency)
                    .withContext(`Incorrect dependency at index ${i}`)
                    .toBe(original);
            }
        });

        it('decorate both class and method', function () {
            // This test doesn't add much value... but thought it might
            // be good to just ensure that decorator works as intended, when
            // a class and it's methods have dependencies meta defined

            // Some dependencies (e.g. identifiers in this case)
            let a = Symbol('xml-driver');
            let b = Symbol('csv-driver');

            // The target component
            @dependsOn(a)
            class Reader {

                @dependsOn(b)
                process(driver = null) {
                    // ...n/a
                }
            }

            // ------------------------------------------------------- //

            const reflector = new DependenciesReflector();

            expect(reflector.get(Reader)[0])
                .withContext('Incorrect class dependency')
                .toBe(a);

            expect(reflector.get(Reader.prototype.process)[0])
                .withContext('Incorrect method dependency')
                .toBe(b);
        });

    });

});
