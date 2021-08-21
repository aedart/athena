import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import replace from '@rollup/plugin-replace';
//import eslint from '@rollup/plugin-eslint';
//import babel from '@rollup/plugin-babel';
import path from 'path'
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import dts from "rollup-plugin-dts";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete'

/*****************************************************************
 * Common Settings
 ****************************************************************/

/**
 * The default entry point to look for in packages
 *
 * @type {string}
 */
export const DEFAULT_ENTRY_POINT = 'src/index.ts';

/*****************************************************************
 * Module Export Methods
 ****************************************************************/

/**
 * Returns default export configuration for a package
 *
 * @return {object[]}
 */
export const makeExports = function() {
    // Obtain current package schema
    const schema = getPackageSchema();

    // Clear out the current package's dist directory
    clearDistDirectory()

    // Return the export configuration for rollup
    return [
        exportUmd({}, schema),
        exportCommonJs({}, schema),
        exportEsModule({}, schema),
        exportTypeScriptDeclarations({}, schema),
        exportClearDtsFiles({}, schema)
    ];
};

/**
 * Returns a "UMD (Universal Module Definition) - (browser)" export setting
 *
 * @param {object} config
 * @param {object|null} [schema]
 *
 * @return {object}
 */
export const exportUmd = function( config = {}, schema = null) {
    schema = resolvePackageSchema(schema);

    const plugins = [
        makeTypeScriptConfig(),
        peerDepsExternal(),
        resolve(),
        commonjs(),
        // eslint(),
        // makeBabelConfig(),
        makeCleanupConfig()
    ]

    const name = schema.name.split('/')[1];

    // Debug
    // console.log('UMD module name', name);

    return Object.assign({
        input: DEFAULT_ENTRY_POINT,
        output: {
            name: name,
            //file: 'dist/index.umd.js',
            file: schema.browser,
            format: 'umd',
            sourcemap: true,
            banner: makeBannerText(schema)
        },
        plugins
    }, config);
};

/**
 * Returns a "Common Js - (main)" export setting
 *
 * @param {object} config
 * @param {object|null} [schema]
 *
 * @return {object}
 */
export const exportCommonJs = function(config = {}, schema = null) {
    schema = resolvePackageSchema(schema);

    const plugins =  [
        makeTypeScriptConfig(),
        peerDepsExternal(),
        // eslint(),
        // makeBabelConfig(),
        makeCleanupConfig()
    ];

    return Object.assign({
        input: DEFAULT_ENTRY_POINT,
        output: {
            //file: 'dist/index.cjs.js',
            file: schema.main,
            format: 'cjs',
            sourcemap: true,
            banner: makeBannerText(schema)
        },
        plugins
    }, config);
};

/**
 * Returns a "ES Module - (module)" export setting
 *
 * @param {object} config
 * @param {object|null} [schema]
 *
 * @return {object}
 */
export const exportEsModule = function(config = {}, schema = null) {
    schema = resolvePackageSchema(schema);

    const plugins = [
        makeTypeScriptConfig(),
        peerDepsExternal(),
        // eslint(),
        // makeBabelConfig(),
        makeCleanupConfig()
    ];

    return Object.assign({
        input: DEFAULT_ENTRY_POINT,
        output: {
            // file: 'dist/index.esm.js',
            file: schema.module,
            format: 'es',
            sourcemap: true,
            banner: makeBannerText(schema)
        },
        plugins
    }, config);
};

/**
 * Returns a "bundle typescript declaration files" configuration
 *
 * @see https://github.com/Swatinem/rollup-plugin-dts
 *
 * @param {object} config
 * @param {object|null} [schema]
 *
 * @return {object}
 */
export const exportTypeScriptDeclarations = function(config = {}, schema = null) {
    schema = resolvePackageSchema(schema);

    const plugins = [
        dts(),
    ];

    return Object.assign({
        // We expect each packages to have an index.d.ts inside dist/dts.
        // This SHOULD be set by default, via makeTypeScriptConfig()
        input: 'dist/dts/index.d.ts',

        output: {
            // file: 'dist/index.d.ts',
            file: schema.types,
            format: 'es',
            banner: makeBannerText(schema)
        },
        plugins
    }, config);
};

/**
 * Returns a "clear d.ts" configuration
 *
 * @see https://github.com/vladshcherbin/rollup-plugin-delete
 *
 * @param {object} config
 * @param {object|null} [schema]
 *
 * @return {object}
 */
export const exportClearDtsFiles = function(config = {}, schema = null) {
    const plugins = [

        del({
            targets: [
                // Delete the entire dist/dts directory
                'dist/dts',

                // For reasons that are beyond me, various *.d.ts files are somehow generated
                // inside ALL packages' src directory. This appears to happen everytime a
                // package is built!
                '../*/src/*.d.ts',
                '../*/src/**/*.d.ts'
            ],
            hook: "buildEnd",
            force: true,
            runOnce: true,
            verbose: false
        }),
    ];

    const packageInfo = getPackageSchema();

    return Object.assign({
        input: packageInfo.module,
        output: {
            // file: 'dist/index.d.ts',
            file: packageInfo.module,
            format: 'es',
        },
        plugins
    }, config);
}

/*****************************************************************
 * Plugin Configurations
 ****************************************************************/

// /**
//  * Returns configured babel plugin
//  *
//  * @return {Plugin}
//  */
// const makeBabelConfig = () => {
//     return babel({ babelHelpers: 'bundled' })
// }

/**
 * Returns configured TypeScript plugin
 *
 * @return {Plugin}
 */
const makeTypeScriptConfig = () => {
    return ts({
        check: false, // TODO: Hmmm... importing other packages yields warnings / errors!
        tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
        cacheRoot: path.resolve(__dirname, '../../node_modules/.rts2_cache'),
        clean: false,
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
            compilerOptions: {
                rootDir: path.resolve(__dirname, 'src'),
                declarationDir: path.resolve(__dirname, 'dist/dts'),
            }
        }
    });
};

/**
 * Returns configured "cleanup" plugin
 *
 * @param {Object} [config]
 *
 * @return {Plugin}
 */
const makeCleanupConfig = (config = {}) => {
    return cleanup(Object.assign({
        comments: 'all',
        compactComments: true
    }, config));
};

/*****************************************************************
 * Utilities
 ****************************************************************/

/**
 * Returns current package.json
 *
 * @return {object}
 */
export const getPackageSchema = () => {
    return JSON.parse(fs.readFileSync('./package.json'));
}

/**
 * Resolves the current package's schema
 *
 * @param {object|null} [schema]
 *
 * @return {object} Given schema or current package.json
 */
export const resolvePackageSchema = (schema = null) => {
    return (schema !== null)
        ? schema
        : getPackageSchema();
}

/**
 * Clears the dist directory for the current package
 */
export const clearDistDirectory = () => {
    deleteDirectory(path.resolve(__dirname, 'dist'));
};

/**
 * Delete a directory
 *
 * @param {string} path
 * @param {boolean} [recursive]
 */
export const deleteDirectory = (path, recursive = true) => {
    try {
        fs.rmdirSync(path, { recursive: recursive });

        console.log(`Deleting directory ${path}`);
    } catch (error) {
        console.error(`Unable to delete directory ${path}`, error);
    }
}

/**
 * Creates a banner text
 *
 * @param {object|null} [packageSchema]
 *
 * @return {string}
 */
export const makeBannerText = function(packageSchema = null) {
    const packageInfo = (packageSchema !== null)
        ? packageSchema
        : getPackageSchema();

    const name = packageInfo.name;
    const license = packageInfo.license;

    const date = new Date().getFullYear();

    return `/**
 * ${name}
 * 
 * ${license}, Copyright (c) 2021-${date} Alin Eugen Deac <aedart@gmail.com>
 */`;
}
