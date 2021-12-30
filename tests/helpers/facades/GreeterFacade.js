import { Facade } from "@aedart/facades";
import { GREETER_IDENTIFIER } from "./Greeter";

/**
 * GreeterFacade
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
}

export default new GreeterFacade();
