import Container, {
    BindingResolutionException
} from "@aedart/container";
import { dependsOn } from "@aedart/reflections";

describe('@aedart/container', () => {

    describe('Make & Build', () => {

        it('fails when unable to build', function () {
            let container = new Container();

            let attempt = () => {
                container.make('something-that-does-not-exist');
            }

            expect(attempt)
                .toThrowError(BindingResolutionException);
        });

        it('can make buildable instance', function () {
            let container = new Container();

            class Box {}

            let box = container.make(Box);

            // --------------------------------------------------------- //

            expect(box)
                .withContext('Unable to make buildable instance')
                .toBeInstanceOf(Box);
        });

        it('can build instance with custom parameters', function () {

            let container = new Container();

            class Box {
                constructor(width, height) {
                    this.width = width;
                    this.height = height;
                }
            }

            // --------------------------------------------------------- //

            let width = 42;
            let height = 45;
            let box = container.make(Box, width, height);

            // --------------------------------------------------------- //

            expect(box.width)
                .withContext('Incorrect parameter width')
                .toBe(width);

            expect(box.height)
                .withContext('Incorrect parameter height')
                .toBe(height);
        });

        it('can resolve nested dependencies', function () {
            let container = new Container();

            let a = 'service-a';
            class ServiceA {}

            let b = 'service-b'
            class ServiceB {}

            @dependsOn(a, b)
            class ServiceC {
                constructor(a, b) {
                    this.a = a;
                    this.b = b;
                }
            }

            container.bind(a, ServiceA);
            container.bind(b, ServiceB);

            // --------------------------------------------------------- //

            let service = container.make(ServiceC);

            // --------------------------------------------------------- //

            expect(service.a)
                .withContext('Incorrect parameter a')
                .toBeInstanceOf(ServiceA);

            expect(service.b)
                .withContext('Incorrect parameter b')
                .toBeInstanceOf(ServiceB);
        });

        it('can make bound instance', function () {
            let container = new Container();

            let abstract = 'my-box'
            class Box {}

            container.bind(abstract, () => {
                return new Box();
            });

            // --------------------------------------------------------- //

            let box = container.makeOrDefault(abstract);

            // --------------------------------------------------------- //

            expect(box)
                .withContext('Unable to make resolve binding')
                .toBeInstanceOf(Box);
        });

        it('resolves to default value when no binding exists', function () {
            let container = new Container();

            let abstract = 'my-box'
            let defaultValue = 'my-default-instance';

            // --------------------------------------------------------- //

            let box = container.makeOrDefault(abstract, defaultValue);

            // --------------------------------------------------------- //

            expect(box)
                .withContext('Default value not resolved')
                .toBe(defaultValue);
        });
    });
});
