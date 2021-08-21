// Base karma configuration
const baseConfig = require('./base.conf.js');

/**
 * Production testing configuration
 *
 * @param {object} config
 */
module.exports = function(config) {

    console.group('Test Environment');
    console.info('Production');
    console.groupEnd();

    config.set(Object.assign(
        baseConfig(config),
        {
            browsers: [
                'Chrome',
                'Firefox',
            ],
        }
    ));
}
