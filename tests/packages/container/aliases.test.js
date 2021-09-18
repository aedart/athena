import Container from "@aedart/container";

describe('@aedart/container', () => {

    describe('Aliases', () => {

        it('can alias a binding', function () {
            let container = new Container();

            let abstract = 'something';
            let alias = 'else';
            let expected = 'sweet';

            container.bind(abstract, () => expected);
            container.alias(abstract, alias);

            // --------------------------------------------------------- //

            expect(container.bound(alias))
                .withContext('Unable to determine if was bound using alias')
                .toBeTrue();

            let result = container.get(alias);
            expect(result)
                .withContext('Unable to build using alias')
                .toBe(expected);
        });

        it('fails when alias is the same as binding identifiers', function () {
            let container = new Container();

            let abstract = 'something';
            let expected = 'sweet';

            container.bind(abstract, () => expected);

            let callback = () => {
                return container.alias(abstract, abstract);
            };

            expect(callback)
                .withContext('Should not be allowed to defined alias using same identifier')
                .toThrowError(TypeError);
        });
    });
});
