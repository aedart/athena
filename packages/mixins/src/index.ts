import Bare from "./decorators/Bare";
import HasInstance from "./decorators/HasInstance";
import Cached from "./decorators/Cached";
import Wrapper from "./helpers/Wrapper";
import Mixer from "./Mixer";
import {
    decorate,
    isApplicationOf,
    hasMixin,
    mix
} from './helpers'

// Export package methods
export {
    // Helpers
    hasMixin,
    isApplicationOf,
    decorate,
    mix as default,

    // Decorators
    HasInstance,
    Cached,
    Bare,

    // Builder and wrapper components
    Wrapper,
    Mixer,
};
