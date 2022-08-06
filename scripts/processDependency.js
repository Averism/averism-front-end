const fs = require('fs');
const path = require('path');

function getDependencyFromFile(filepath){
    if(!filepath.endsWith('.ts')) return [];
    let rows = fs.readFileSync(filepath, 'utf8').split('\n').map(x=>x.trim()).filter(x=>x.length > 0)
    return rows.filter(x=>x.startsWith('import')).map(x=>x.split('from ')[1]
        .split("'").join('').split('"').join('').trim().replace(';','')).filter(x=>x.split('/').length > 2 || x.startsWith('../'));
}

function translateDependency(context,dependency) {
    if(context == 'module') {
        if(dependency.startsWith('../../components')) {
            return dependency.replace('../../components', 'component_');
        } else if(dependency.startsWith('../')) {
            return dependency.replace('../', 'module_');
        }
    } else if(context == 'component') {
        if(dependency.startsWith('../module')) {
            return dependency.replace('../module/', 'module_').replace(/\/index(.ts)?$/,'');
        }else if(dependency.startsWith('../')) {
            return dependency.replace('../components', 'component_');
        }  
    }
}

module.exports = async function processDependency() {
    let result = {};
    const modules = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'module'))
    for(let module of modules) {
        const files = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'module', module))
        const moduleDependency = new Set();
        for(let file of files) {
            let filepath = path.join(__dirname, '..', 'src', 'module', module, file)
            moduleDependency.add(...getDependencyFromFile(filepath).map(x=>translateDependency('module',x)));
        }
        result[`module_${module}`] = Array.from(moduleDependency).filter(x=>x);
    }
    const components = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'components'));
    for(let component of components) {
        const filepath = path.join(__dirname, '..', 'src', 'components', component);
        result[`component_${component.substring(0,component.length-3)}`] = getDependencyFromFile(filepath).filter(x=>x).map(x=>translateDependency('component',x));
    }
    return result;
}