import NameMixin from "./mixins/NameMixin";
import mix from "@aedart/mixins";

import PlayerContract from "./contracts/Player";
interface Player extends PlayerContract {}

/**
 * Player
 *
 * @mixes NameMixin
 */
class Player extends mix().with(
    NameMixin
) implements PlayerContract
{
    constructor() {
        super();

        this.name = 'Jimmy';

        console.log('Name', this.name, this.defaultName(), this.fullName());
    }

    fullName(): string {
        return this.name + ' the 2nd';
    }
}

export default Player;
