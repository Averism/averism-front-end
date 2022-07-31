const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function readFilesRecursive(basepath){
    let files = [];
    let dirs = [];
    let dir = fs.readdirSync(basepath);
    dir.forEach(function(file){
        let filepath = path.join(basepath, file);
        let stat = fs.statSync(filepath);
        if(stat.isDirectory()){
            dirs.push(filepath);
        }else{
            files.push(filepath);
        }
    }
    );
    dirs.forEach(function(dir){
        files = files.concat(readFilesRecursive(dir));
    }
    );
    return files;
}

module.exports = async function() {

    // Generate HTML Pages
    let pages = readFilesRecursive('./pages').filter(x=>x.endsWith('.yml'));
    for(let page of pages){
        let pageData = yaml.load(fs.readFileSync(page, 'utf8'));
        let pageName = page.replace('pages/', '').replace('.yml', '');
        let template = fs.readFileSync('./templates/html', 'utf8');
        let pageHTML = template.replace('{{title}}', pageData.data.description || pageData.title)
            .replace('{{content}}', pageData.content);
        fs.writeFileSync(`./build/${pageName}.html`, pageHTML);
    }
}