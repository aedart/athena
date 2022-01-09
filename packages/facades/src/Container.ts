import ContainerContract, {
    BindingIdentifier,
    CONTAINER,
} from "@aedart/contracts/dist/container";
import Facade from "./Facade";

/**
 * Service Container Facade
 */
class Container extends Facade {

    /**
     * @inheritdoc
     */
    facadeAccessor(): BindingIdentifier {
        return CONTAINER;
    }
}

const container: ContainerContract & Container = Container.initFacade();

export default container;
