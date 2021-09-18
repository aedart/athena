import Container from "@aedart/container";

describe('@aedart/container', () => {

    describe('Bindings', () => {

        it('can bind using factory callback', function () {
            let container = new Container();

            let abstract = 'my-binding';
            let expected = 'sweet';

            container.bind(abstract, () => {
                return expected;
            });

            // --------------------------------------------------------- //

            expect(container.bound(abstract))
                .withContext('Target was not bound')
                .toBeTrue();

            let result = container.get(abstract);
            expect(result)
                .withContext('Unable to build using factory callback')
                .toBe(expected);
        });

        it('can bind using a class reference', function () {
            let container = new Container();

            let abstract = 'my-binding';
            class MyService {}

            container.bind(abstract, MyService);

            // --------------------------------------------------------- //

            expect(container.bound(abstract))
                .withContext('Target was not bound')
                .toBeTrue();

            let result = container.get(abstract);
            expect(result)
                .withContext('Unable to build using class reference')
                .toBeInstanceOf(MyService);

            let control = container.get(abstract);
            expect(control)
                .withContext('Unable to build using class reference')
                .toBeInstanceOf(MyService);

            expect(control)
                .withContext('Expected a new instance and not shared instance!')
                .not.toBe(result)
        });

        it('can bind singleton instance using factory callback', function () {
            let container = new Container();

            let abstract = 'my-binding';
            class CacheService {}
            let expected = new CacheService();

            container.singleton(abstract, () => {
                return expected;
            });

            // --------------------------------------------------------- //

            expect(container.bound(abstract))
                .withContext('Target was not bound')
                .toBeTrue();

            let result = container.get(abstract);
            expect(result)
                .withContext('Unable to build singleton using factory callback')
                .toBe(expected);

            let control = container.get(abstract);
            expect(control)
                .withContext('Expected a shared instance')
                .toBe(result)
        });

        it('can bind singleton instance using a class reference', function () {
            let container = new Container();

            let abstract = 'my-binding';
            class UsersRepository {}

            container.singleton(abstract, UsersRepository);

            // --------------------------------------------------------- //

            expect(container.bound(abstract))
                .withContext('Target was not bound')
                .toBeTrue();

            let result = container.get(abstract);
            expect(result)
                .withContext('Unable to build singleton using class reference')
                .toBeInstanceOf(UsersRepository);

            let control = container.get(abstract);
            expect(control)
                .withContext('Expected a shared instance')
                .toBe(result);
        });

        it('can bind concrete instance', function () {
            let container = new Container();

            let abstract = 'my-binding';

            class ApiGateway {}
            let instance = new ApiGateway();

            container.instance(abstract, instance);

            // --------------------------------------------------------- //

            expect(container.bound(abstract))
                .withContext('Target was not bound')
                .toBeTrue();

            let result = container.get(abstract);
            expect(result)
                .withContext('Unable to obtain instance')
                .toBe(instance);

            let control = container.get(abstract);
            expect(control)
                .withContext('Expected same instance')
                .toBe(result);
        });

    });
});
