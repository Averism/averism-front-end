const buildPages = require('./buildPages');
const fs = require('fs');

async function build(){

    console.log("resetting build folder")
    if(!fs.existsSync('./build')){
        fs.mkdirSync('./build');
    } else {
        fs.rmSync('./build', {recursive: true});
        fs.mkdirSync('./build');
    }

    console.log("building html pages");
    await buildPages();
    return;
}

build();