const webpack = require("webpack");
const DllReferencePlugin = webpack.DllReferencePlugin;
const configF = require("../webpack.js");
const fs = require('fs');
const path = require('path');

const modules = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'module'));
const moduleEntry = Object.fromEntries(modules.filter(x => x !== 'servicemanager').map(x => [`module_${x}`, path.resolve(__dirname, '..', 'src', 'module', x, 'index.ts')]));
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
    await runWebpack(configF(moduleEntry, true, ['module_servicemanager']));
    await runWebpack(configF(runnableEntry, false, modules.map(x=>`module_${x}`)));
}