const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');
const pretty = require('pretty');

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

function mergeDependencies(items) {
    return items.reduce((p, c) => {
        c.forEach(x=>{if(!p.includes(x)) p.push(x)});
        return p;
    }, []);
}

function getDependency(item, dependencies) {
    let result = dependencies[item];
    if (result && result.length > 0) {
        result = mergeDependencies(result.map(x=>getDependency(x, dependencies)))
    }
    return result.concat(item);
}

function compileDependency(pageData, dependencies) {
    const components = pageData.components.map(x=>x.component);
    let result = [];
    for(let component of components) {
        let current = ["component_" + component];
        let componentDeps = getDependency(current, dependencies);
        result = mergeDependencies([result, componentDeps]);
    }
    return result;
}

module.exports = async function(dependencies) {

    // Generate HTML Pages
    let pages = readFilesRecursive('./pages').filter(x=>x.endsWith('.yml'));
    for(let page of pages){
        let pageData = yaml.load(fs.readFileSync(page, 'utf8'));
        let pageName = page.replace('pages/', '').replace('.yml', '');
        let template = fs.readFileSync('./templates/html', 'utf8');
        let scripts = compileDependency(pageData, dependencies).map(x=>`<script src="scripts/${x}.js"></script>`).join('\n');
        let body = pageData.components.map(x=>x.layout).filter(x=>x).map(x=>`./templates/${x}.html`).map(x=>fs.readFileSync(x, 'utf8')).join('\n');
        let pageTemplate = Handlebars.compile(template, {noEscape: true})({scripts,body});
        let pageHTML = pretty(Handlebars.compile(pageTemplate, {noEscape: true})(pageData.data));
        fs.writeFileSync(`./build/${pageName}.html`, pageHTML);
    }
}