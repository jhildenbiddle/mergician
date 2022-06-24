const esbuild = require('esbuild');
const pkg = structuredClone(require('./package.json'));

const isWatch = process.argv.includes('--watch');

// Copyright
const currentYear = (new Date()).getFullYear();
const releaseYear = 2022;

// Banner
const bannerData = [
    `${pkg.name}`,
    `v${pkg.version}`,
    `${pkg.homepage}`,
    `(c) ${releaseYear}${currentYear === releaseYear ? '' : '-' + currentYear} ${pkg.author}`,
    `${pkg.license} license`
];


// Config
// =============================================================================
// Base
const config = {
    entryPoints: ['src/index.cjs'],
    bundle: true,
    banner: {
        js: `/*!\n * ${ bannerData.join('\n * ') }\n */`
    },
    legalComments: 'inline',
    target: ['esnext'],
    outfile: 'dist/mergedeep.js',
    watch: isWatch,
};

const cjs = {
    ...config,
    format: 'cjs',
    outfile: config.outfile.replace(/\.js$/, '.cjs'),
};

const esm = {
    ...config,
    format: 'esm',
    outfile: config.outfile.replace(/\.js$/, '.mjs'),
};

const jsMinified = {
    ...esm,
    minify: true,
    legalComments: 'none',
    sourcemap: true,
    outfile: config.outfile.replace(/\.js$/, '.min.js'),
};


// Build
// =============================================================================
// eslint-disable-next-line no-console
console.log(`esbuild: ${isWatch ? 'watching' : 'building'}...`);

[cjs, esm, jsMinified].forEach(config => {
    esbuild
        .build(config)
        .then(() => {
            // eslint-disable-next-line no-console
            console.log(`esbuild: ${config.entryPoints} => ${config.outfile}`);
        })
        .catch(() => process.exit(1));
});
