const webpack = require("webpack");
const DllReferencePlugin = webpack.DllReferencePlugin;
const configF = require("../webpack.js");
const fs = require('fs');
const path = require('path');

const modules = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'module')).filter(x => x !== 'servicemanager');
const moduleEntry = Object.fromEntries(modules.map(x => [`module_${x}`, path.resolve(__dirname, '..', 'src', 'module', x, 'index.ts')]));
const modulesPlugin = modules.map(x => new DllReferencePlugin({
    manifest: path.resolve(__dirname, '..', 'build', 'scripts', "manifests", `module_${x}.json`),
    sourceType: "jsonp"
}
));
const runnables = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'runnable')).map(x => x.split('.')[0]);
const runnableEntry = Object.fromEntries(runnables.map(x => [`runnable_${x}`, path.resolve(__dirname, '..', 'src', 'runnable', x + '.ts')]));

async function runWebpack(config) {
    return new Promise((resolve, reject) => {
        webpack(config, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                console.log(stats.toString({ colors: true }));
                resolve(stats);
            }
        });
    });
}

module.exports = async function buildScripts() {
    await runWebpack(configF({ module_servicemanager: path.resolve(__dirname, '..', 'src', 'module', 'servicemanager', 'index.ts') }, true));
    await runWebpack(configF(moduleEntry, true, [new DllReferencePlugin(
        {
            manifest: path.resolve(__dirname, '..', 'build', 'scripts', "manifests", `module_servicemanager.json`),
            sourceType: "jsonp"
        }
    )]));
    await runWebpack(configF(runnableEntry, false, modulesPlugin));
}