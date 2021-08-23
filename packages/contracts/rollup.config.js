import {
    getPackageSchema,
    clearDistDirectory,
    exportUmd,
    exportCommonJs,
    exportEsModule,
    exportTypeScriptDeclarations,
    exportClearDtsFiles
} from '../../rollup.common.js';

/*****************************************************************
 * Sub modules export utils
 ****************************************************************/

/**
 * Returns export settings for a "sub-module"
 *
 * @param {string} target Target sub-module directory, e.g. "container".
 *                        Expects a "src/container/index.ts" to exists
 * @param {object|null} [schema]
 *
 * @return {object}
 */
const exportSubModule = (target, schema = null) => {
    let inputFile = 'src/' + target + '/index.ts';

    const makeOutFile = (format) => {
        return 'dist/' + target + format;
    }

    const umd = exportUmd({}, schema);
    umd.input = inputFile;
    umd.output.file = makeOutFile('.umd.js');

    const commonJs = exportCommonJs({}, schema);
    commonJs.input = inputFile;
    commonJs.output.file = makeOutFile('.cjs.js');

    const es = exportEsModule({}, schema);
    es.input = inputFile;
    es.output.file = makeOutFile('.esm.js');

    const ts = exportTypeScriptDeclarations({
        input: 'dist/dts/' + target + '/index.d.ts'
    }, schema);
    ts.output.file = 'dist/' + target + '.d.ts';

    return [
        umd,
        commonJs,
        es,
        ts
    ];
};

/*****************************************************************
 * Export all sub modules
 ****************************************************************/

// Obtain current package schema
const schema = getPackageSchema();

// Clear out the current package's dist directory
clearDistDirectory();

export default [
    // Export the main "contracts" module
    exportUmd({}, schema),
    exportCommonJs({}, schema),
    exportEsModule({}, schema),
    exportTypeScriptDeclarations({}, schema),

    // Export sub modules
    ...exportSubModule('container'),
    ...exportSubModule('meta'),

    // Finally, clear the dts directory
    exportClearDtsFiles()
];
