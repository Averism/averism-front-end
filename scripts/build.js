const buildPages = require('./buildPages');
const buildScripts = require('./buildScripts');
const processDependency = require('./processDependency');
const fs = require('fs');

async function build(){

    console.log("resetting build folder")
    if(!fs.existsSync('./build')){
        fs.mkdirSync('./build');
    } else {
        fs.rmSync('./build', {recursive: true});
        fs.mkdirSync('./build');
    }

    console.log("building scripts");
    await buildScripts();

    console.log("building dependencies");
    const dependency = await processDependency();

    console.log("building html pages");
    await buildPages(dependency);
    return;
}

build();