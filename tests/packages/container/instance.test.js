import Container from "@aedart/container";

describe('@aedart/container', () => {

    describe('Container Instance', () => {

        it('can obtain instance', function () {

            let container = Container.getInstance();

            expect(container)
                .withContext('Container instance was not obtained')
                .not.toBeUndefined()
        });

        it('can set custom instance', function () {
            let containerA = new Container();
            let containerB = Container.setInstance(containerA);

            expect(containerB)
                .withContext('Custom instance not set')
                .toBe(containerA);
        });

        it('can destroy instance', function () {
            let containerA = new Container();
            let containerB = Container.setInstance(containerA);

            Container.destroy();

            expect(Container.getInstance())
                .withContext('Instance was not destroyed')
                .not.toBe(containerA);
        });
    });
});
