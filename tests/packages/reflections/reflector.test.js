import {Reflector} from "@aedart/reflections";

describe('@aedart/reflections', () => {

    describe('Reflector', () => {

        it('can determine if target is callable', function () {

            let a = class {};
            let b = function () {};
            let c = () => {};
            let d = 'something else';

            expect(Reflector.isCallable(a))
                .withContext('Class should be callable')
                .toBeTrue();

            expect(Reflector.isCallable(b))
                .withContext('Function should be callable')
                .toBeTrue();

            expect(Reflector.isCallable(c))
                .withContext('Function (shorthand) should be callable')
                .toBeTrue();

            expect(Reflector.isCallable(d))
                .withContext('A string should not be callable')
                .toBeFalse()
        });

        it('can determine if target is a class reference (ES6)', function () {

            let a = class {};
            let b = function () {};
            let c = { foo: function() {} };

            expect(Reflector.isClass(a))
                .toBeTrue();

            expect(Reflector.isClass(b))
                .withContext('Regular function should not be identified as a class')
                .toBeFalse();

            expect(Reflector.isClass(c))
                .withContext('Object should NOT be identified as a class')
                .toBeFalse();
        });

        it('can determine if target is a class reference (Babel)', function () {

            // ------------------------------------------------------------------ //
            // Source from:
            // @see https://babeljs.io/docs/en/babel-plugin-transform-classes
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            const Test = (function() {
                function Test(name) {
                    _classCallCheck(this, Test);

                    this.name = name;
                }

                return Test;
            })();

            expect(Reflector.isClass(Test))
                .toBeTrue();
        });

        it('can use custom class determination callback', function () {

            let original = Reflector.determineClassesVia((target) => {
                return true;
            });

            const target = { name: 'Timmy' };

            expect(Reflector.isClass(target))
                .withContext('Custom callback was not applied')
                .toBeTrue();

            // ------------------------------------------------------- //
            // Cleanup
            Reflector.determineClassesVia(original);
        });
    });

});
