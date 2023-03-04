export default interface NameAware {

    set name(name: string);

    get name(): string;

    defaultName(): string;
}
