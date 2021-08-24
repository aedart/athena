import Meta from "@aedart/meta";

describe('@aedart/meta', () => {

    it('can obtain instance', function () {
        let meta = Meta.getInstance();

        expect(meta).not.toBe(undefined);
    });

    it('can set and retrieve arbitrary data for target', function () {
        let meta = Meta.getInstance();

        let target =  () => {};
        let data = { a: true, b: 'something', c: [1, 2, 3] };

        meta.set(target, data);

        // --------------------------------------------------- //

        expect(meta.has(target))
            .withContext('Has target')
            .toBeTrue()

        let result = meta.get(target);
        expect(result)
            .withContext('Obtained meta data does not match stored data')
            .toBe(data);
    });

    it('can set and retrieve using custom type', function () {
        let meta = Meta.getInstance();

        let target =  class {};
        let data = 'For a crusted iced porridge, add some crême fraîche and thyme.';
        let type = 'my custom type';

        meta.set(target, data, type);

        // --------------------------------------------------- //

        expect(meta.has(target))
            .withContext('Should not have meta, when NO TYPE specified')
            .toBeFalse();

        expect(meta.has(target, type))
            .withContext('Should have meta, when type specified')
            .toBeTrue();

        expect(meta.get(target))
            .withContext('Should not have retrieved any meta data, when no type specified')
            .toBeUndefined();

        expect(meta.get(target, type))
            .withContext('Obtained meta data does not match stored data')
            .toBe(data);
    });

    it('can forget meta for target', function () {
        let meta = Meta.getInstance();

        const DummyClass = class {
            myMethod() {
                return true;
            }
        }

        let target =  DummyClass.prototype.myMethod;
        let data = [1, 2, 3]

        meta.set(target, data);

        // --------------------------------------------------- //

        expect(meta.has(target))
            .withContext('Should have meta for target')
            .toBeTrue()

        // --------------------------------------------------- //

        let result = meta.forget(target);
        expect(result)
            .withContext('Should had deleted meta for target')
            .toBeTrue();

        expect(meta.has(target))
            .withContext('Should no longer have meta for target')
            .toBeFalse();
    });

    it('can forget all meta for target', function () {

        let meta = Meta.getInstance();

        let target =  { name: 'John' }
        let data = { job: 'developer' }
        let type = 'custom type';

        meta.set(target, data);
        meta.set(target, data, type); // Duplicate stored on purpose...

        meta.forget(target, type);

        // --------------------------------------------------- //

        expect(meta.has(target, type))
            .withContext('Should not have meta for target and type')
            .toBeFalse();

        expect(meta.has(target))
            .withContext('Should still have meta - without type')
            .toBeTrue();

        // --------------------------------------------------- //

        meta.forgetAll(target);
        expect(meta.has(target))
            .withContext('Should not have any meta for target!')
            .toBeFalse();
    });

    it('meta is removed when target no longer exists', function () {

        let meta = Meta.getInstance();

        let obj = {
            name: function() {
                return 'Tim';
            }
        }

        let data = () => true;

        meta.set(obj['name'], data);

        // --------------------------------------------------- //

        expect(meta.has(obj['name']))
            .withContext('Should have meta for target')
            .toBeTrue();

        // --------------------------------------------------- //

        // By deleting the object's property, the internal Weak Map
        // of the meta store SHOULD loose it's reference and the
        // meta should no longer exists.
        delete obj['name'];

        expect(obj.hasOwnProperty('name'))
            .withContext('Target not removed from object')
            .toBeFalse();

        expect(meta.has(obj['name']))
            .withContext('Target should no longer exists')
            .toBeFalse();
    });
});
