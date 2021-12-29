import Container from "@aedart/container";
import { dependsOn } from "@aedart/reflections";

fdescribe('@aedart/container', () => {

    describe('Call', () => {

        it('can call method', function () {
            let container = new Container();

            let expected = 'abc';
            let method = () => {
                return expected
            }

            // --------------------------------------------------------- //

            let result = container.call(method);

            // --------------------------------------------------------- //

            expect(result)
                .withContext('Unable to call method')
                .toBe(expected);
        });

        it('can call method with arguments', function () {
            let container = new Container();

            let a = 'Hi';
            let b = 'John'
            let method = (a, b) => {
                return [a, b].join(' ');
            }

            // --------------------------------------------------------- //

            let result = container.call(method, a, b);

            // --------------------------------------------------------- //

            expect(result)
                .withContext('Incorrect parameters given to method')
                .toBe('Hi John');
        });

        it('can resolve method dependencies', function () {
            let container = new Container();

            let abstract = 'my-service';
            let expected = 'SOME CACHED VALUE';
            class CacheService {
                get() {
                    return expected
                }
            }

            container.bind(abstract, CacheService);

            // WARNING: This is not yet supported!
            // @dependsOn(abstract)
            // function method(cache) {
            //     return cache.get();
            // }

            let method = (cache) => {
                return cache.get();
            }

            let reflector = container.reflector;
            reflector.set(method, [abstract]);

            // --------------------------------------------------------- //

            let result = container.call(method);

            // --------------------------------------------------------- //

            expect(result)
                .withContext('Unable to resolve method dependencies')
                .toBe(expected);
        });

        it('can call class method', function () {
            let container = new Container();

            let expected = 'Jenny Clarkson';
            class User {
                name() {
                    return expected;
                }
            }

            // --------------------------------------------------------- //

            let result = container.call([User, 'name']);

            // --------------------------------------------------------- //

            expect(result)
                .withContext('Unable to call class method')
                .toBe(expected);
        });

        it('can call class method with arguments', function () {
            let container = new Container();

            let first = 'Tine';
            let last = 'Benny'
            class User {
                fullName(first, last) {
                    return [first, last].join(' ');
                }
            }

            // --------------------------------------------------------- //

            let result = container.call([User, 'fullName'], first, last);

            // --------------------------------------------------------- //

            expect(result)
                .withContext('Unable to call class method with arguments')
                .toBe('Tine Benny');
        });

        it('can resolve class method dependencies', function () {
            let container = new Container();

            let expected = {
                name: 'George'
            };

            let abstract = 'repository';
            class Repository {
                get() {
                    return expected;
                }
            }

            container.bind(abstract, Repository);

            // --------------------------------------------------------- //

            class User {

                @dependsOn(abstract)
                fetchUsing(repository) {
                    return repository.get();
                }
            }

            // --------------------------------------------------------- //

            let result = container.call([User, 'fetchUsing']);

            // --------------------------------------------------------- //

            expect(result)
                .withContext('Unable to resolve class method dependencies')
                .toBe(expected);
        });

        it('can resolve class and method dependencies', function () {
            let container = new Container();

            let user = {
                name: 'Isabella'
            };
            let expected = `<<${user.name}>>`;

            let usersService = 'repository';
            class Repository {
                get() {
                    return user;
                }
            }

            let decoratorService = 'users-decorator';
            class UsersDecorator {
                make(user) {
                    user.name = `<<${user.name}>>`;
                    return user;
                }
            }

            container.bind(usersService, Repository);
            container.bind(decoratorService, UsersDecorator);

            // --------------------------------------------------------- //

            @dependsOn(usersService)
            class User {

                constructor(repository) {
                    this.repository = repository;
                }

                @dependsOn(decoratorService)
                find(decorator) {
                    return decorator.make(
                        this.repository.get()
                    );
                }
            }

            // --------------------------------------------------------- //

            let result = container.call([User, 'find']);

            // --------------------------------------------------------- //

            expect(result.name)
                .withContext('Unable to resolve class and method dependencies')
                .toBe(expected);
        });
    });
});
