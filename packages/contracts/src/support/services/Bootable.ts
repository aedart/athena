/**
 * Bootable
 */
export default interface Bootable {

    /**
     * Boot the services that are offered by this provider
     */
    boot(): PromiseLike<any> | undefined;
}
