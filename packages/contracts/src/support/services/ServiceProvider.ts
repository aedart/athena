/**
 * Service Provider
 */
export default interface ServiceProvider {

    /**
     * Register services for your application
     *
     * @return {void}
     */
    register(): void;
}
