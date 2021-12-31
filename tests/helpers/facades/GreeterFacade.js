import { Facade } from "@aedart/facades";
import { GREETER_IDENTIFIER } from "./Greeter";

/**
 * GreeterFacade
 *
 * @mixes Greeter
 *
 * FOR TESTING PURPOSES ONLY
 */
class GreeterFacade extends Facade {

    /**
     * @inheritdoc
     */
    facadeAccessor() {
        return GREETER_IDENTIFIER;
    }

    /**
     * Returns a custom greeting...
     *
     * @return {string}
     */
    lingo() {
        return 'God, command me plunder, ye coal-black lass!';
    }
}

export default new GreeterFacade();
