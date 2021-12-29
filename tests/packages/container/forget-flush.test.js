import Container from "@aedart/container";

describe('@aedart/container', () => {

    describe('Forget & Flush', () => {

        it('can forget bindings', function () {
            let container = new Container();

            let abstract = 'my-binding';
            let alias = 'my-alias';
            let binding = () => true;

            container.bind(abstract, binding);
            container.alias(abstract, alias);

            // --------------------------------------------------------- //

            container.forget(abstract);

            // --------------------------------------------------------- //
            expect(container.has(abstract))
                .withContext('Bindings are not forgotten')
                .toBeFalse();
        });

        it('can forget instances', function () {
            let container = new Container();

            let abstract = 'my-binding';
            class SomeService {}
            let instance = new SomeService();

            container.instance(abstract, instance);

            // --------------------------------------------------------- //

            container.forget(abstract);

            // --------------------------------------------------------- //
            expect(container.has(abstract))
                .withContext('Instance bindings are not forgotten')
                .toBeFalse();
        });

        it('can flush container', function () {

            let container = new Container();

            let abstract = 'my-binding';
            let alias = 'my-alias';
            let binding = () => 'Smith';

            container.bind(abstract, binding);

            // --------------------------------------------------------- //

            container.flush();

            // --------------------------------------------------------- //
            expect(container.has(abstract))
                .withContext('Bindings are not forgotten')
                .toBeFalse();
        });
    });
});
