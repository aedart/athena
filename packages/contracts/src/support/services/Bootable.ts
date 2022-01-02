/**
 * Bootable
 */
export default interface Bootable {

    /**
     * Boot the services that are offered by this provider
     *
     * @return {PromiseLike<any>|undefined}
     */
    boot(): PromiseLike<any> | undefined;
}
