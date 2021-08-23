import Meta from "@aedart/meta";

describe('@aedart/meta', () => {

    it('can obtain instance', function () {
        let meta = Meta.getInstance();

        expect(meta).not.toBe(undefined);
    });

    // TODO: Add remaining tests for the meta store...

});
