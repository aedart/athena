import Container from "@aedart/container";
import { Facade } from "@aedart/facades";
import Greeter, { GREETER_IDENTIFIER } from "../../helpers/facades/Greeter";
import GreeterFacade from "../../helpers/facades/GreeterFacade";
import faker from 'faker';
import {fa} from "faker/lib/locales";

describe('@aedart/facades', () => {

    /*****************************************************************
     * Setup
     ****************************************************************/

    beforeEach(() => {
        Facade.serviceContainer = Container.getInstance();
    });

    afterEach(() => {
        Facade.clearResolvedInstances();
        Facade.serviceContainer = null;

        let container = Container.getInstance();
        container.flush();
        Container.setInstance(null);
    });

    /*****************************************************************
     * Helpers
     ****************************************************************/

    /**
     * Registers a binding in the service container,
     * so that the "dummy" facade's root can work as intended
     */
    function bindGreeter() {
        let container = Container.getInstance();

        container.bind(GREETER_IDENTIFIER, Greeter);
    }

    /*****************************************************************
     * Actual Tests
     ****************************************************************/

    describe('Facade abstraction', () => {

        it('can set and obtain service container', function () {
            // Reset before attempting to set
            Facade.serviceContainer = null;

            let dummy = {};

            Facade.serviceContainer = dummy;
            let result = Facade.serviceContainer;

            // ------------------------------------------------------ //

            expect(result)
                .withContext('Unable to set and obtain service container')
                .toBe(dummy);

        });

        it('can obtain facade accessor', function () {
            let container = Container.getInstance();

            // NOTE: We MUST bind the "accessor" in container or
            // test will fail as soon as we attempt to retrieve the
            // accessor from the facade!
            let abstract = 'my-accessor';
            container.bind(abstract, () => {
                return {};
            });

            // ------------------------------------------------------ //

            class DummyFacade extends Facade {
                facadeAccessor() {
                    return abstract;
                }
            }

            let dummy = new DummyFacade();
            let result = dummy.facadeAccessor();

            // ------------------------------------------------------ //

            expect(result)
                .withContext('Unable to obtain facade accessor')
                .toBe(abstract);
        });

        it('can resolve instance from service container', function () {
            let container = Container.getInstance();

            let abstract = 'my-service';
            class Service {}

            container.bind(abstract, Service);

            // ------------------------------------------------------ //

            let result = Facade.resolveFacadeInstance(abstract);

            // ------------------------------------------------------ //

            expect(Facade.hasResolvedInstance(abstract))
                .withContext('Facade does not appear to have resolved instance')
                .toBeTrue();

            expect(result)
                .withContext('Unable to resolve instance from service container, using facade')
                .toBeInstanceOf(Service);
        });

        it('can clear resolved instance', function () {
            let container = Container.getInstance();

            let abstract = 'my-service';
            class Service {}

            container.bind(abstract, Service);

            // ------------------------------------------------------ //

            Facade.resolveFacadeInstance(abstract);
            let result = Facade.clearResolvedInstance(abstract);

            // ------------------------------------------------------ //

            expect(result)
                .withContext('It appears facade was unable to clear resolved instance?!?')
                .toBeTrue();

            expect(Facade.hasResolvedInstance(abstract))
                .withContext('Resolved instance was NOT cleared')
                .toBeFalse()
        });
    });

    describe('Facade proxy handler', () => {

        it('can obtain facade root', function () {
            bindGreeter();

            let result = GreeterFacade.facadeRoot();

            // ------------------------------------------------------ //

            expect(result)
                .withContext('Facade root was not resolved correctly')
                .toBeInstanceOf(Greeter);
        });

        it('can proxy properties', function () {
            bindGreeter();

            let expected = faker.name.findName();

            // ------------------------------------------------------ //

            GreeterFacade.customer = expected;
            let result = GreeterFacade.customer;

            // ------------------------------------------------------ //

            expect(result)
                .withContext('Unable to set or obtain property')
                .toBe(expected);
        });

        it('can proxy dynamic properties', function () {

            bindGreeter();

            let expected = faker.name.findName();
            let property = 'foo';

            // ------------------------------------------------------ //

            GreeterFacade[property] = expected;
            let result = GreeterFacade[property];

            // ------------------------------------------------------ //

            expect(result)
                .withContext('Unable to set or obtain dynamic property')
                .toBe(expected);
        });

        it('can proxy methods', function () {
            bindGreeter();

            let name = faker.name.findName();
            let expected = `Welcome ${name}`

            // ------------------------------------------------------ //

            GreeterFacade.customer = name;
            let result = GreeterFacade.greetings();

            // ------------------------------------------------------ //

            expect(result)
                .withContext('Method was not invoked correctly')
                .toBe(expected);
        });

        it('can proxy methods with arguments', function () {
            bindGreeter();

            let name = faker.name.findName();
            let expected = `Welcome ${name}`

            // ------------------------------------------------------ //

            let result = GreeterFacade.sayWelcome(name);

            // ------------------------------------------------------ //

            expect(result)
                .withContext('Method with args. was not invoked correctly')
                .toBe(expected);
        });

        it('can proxy dynamic methods', function () {
            bindGreeter();

            let expected = 'bar';

            // ------------------------------------------------------ //

            let result = GreeterFacade.foo();

            // ------------------------------------------------------ //

            expect(result)
                .withContext('Dynamic method not invoked')
                .toBe(expected);
        });

        it('can invoke method defined in facade', function () {
            bindGreeter();

            let expected = 'God, command me plunder, ye coal-black lass!';

            // ------------------------------------------------------ //

            let result = GreeterFacade.lingo();

            // ------------------------------------------------------ //

            expect(result)
                .withContext('Custom method in facade was not invoked?')
                .toBe(expected);
        });

        it('can invoke method using Reflect.apply', function () {
            bindGreeter();

            let name = faker.name.findName();
            let expected = `Welcome ${name}`

            // ------------------------------------------------------ //

            let result = Reflect.apply(GreeterFacade.sayWelcome, undefined, [name]);

            // ------------------------------------------------------ //

            expect(result)
                .withContext('Method with args. was not invoked correctly')
                .toBe(expected);
        });

        it('can proxy define properties', function () {
            bindGreeter();

            let property = 'shop';
            let value = 'Acme Ltd.';

            // ------------------------------------------------------ //

            Object.defineProperty(GreeterFacade, property, {
                value: value
            });

            let result = GreeterFacade[property];

            // ------------------------------------------------------ //

            expect(property in GreeterFacade)
                .withContext('Property was not defined in facade root')
                .toBeTrue();

            expect(result)
                .withContext('Incorrect property value defined')
                .toBe(value);
        });

        it('can proxy delete properties', function () {
            bindGreeter();

            let property = 'owner';

            // ------------------------------------------------------ //

            Object.defineProperty(GreeterFacade, property, {
                value: faker.name.findName(),
                configurable: true,
                writable: true
            });

            delete GreeterFacade[property];

            // ------------------------------------------------------ //

            expect(property in GreeterFacade)
                .withContext('Property was not deleted in facade root')
                .toBeFalse()
        });

        it('can proxy own property descriptor', function () {
            bindGreeter();

            let name = faker.name.findName();
            GreeterFacade.customer = name;

            // ------------------------------------------------------ //

            let result = Reflect.getOwnPropertyDescriptor(GreeterFacade, '_customer');

            // ------------------------------------------------------ //

            expect(result)
                .withContext('No own property descriptor resolved')
                .not
                .toBeNull();

            expect(result.value)
                .withContext('Unexpected property value in descriptor')
                .toBe(name);
        });

        it('can proxy own keys reflection', function () {
            bindGreeter();

            // ------------------------------------------------------ //

            let result = Reflect.ownKeys(GreeterFacade);

            // ------------------------------------------------------ //

            expect(result.length)
                .withContext('No properties returned')
                .toBeGreaterThan(0);

            let root = GreeterFacade.facadeRoot();
            result.forEach((property) => {
                expect(property in root)
                    .withContext(`${property} does not exist in facade root`)
                    .toBeTrue();
            });
        });
    });
});
