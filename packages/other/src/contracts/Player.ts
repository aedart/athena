import NameAware from "./NameAware";

export default interface Player extends NameAware {

    fullName(): string;

};
