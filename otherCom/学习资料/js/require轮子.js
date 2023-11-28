let fs = require('fs');
let path = require('path');
let b = req('./b.js');
function req(mod) {
    let filename = path.join(__dirname, mod);
    let content = fs.readFileSync(filename, 'utf8');
    let fn = new Function('exports', 'require', 'module', '__filename', '__dirname', content + '\n return module.exports;');
    let module = {
        exports: {}
    };

    return fn(module.exports, req, module, __filename, __dirname);
}


let factories = {};
function define(modName, dependencies, factory) {
    factory.dependencies = dependencies;
    factories[modName] = factory;
}
function require(modNames, callback) {
    let loadedModNames = modNames.map(function (modName) {
        let factory = factories[modName];
        let dependencies = factory.dependencies;
        let exports;
        require(dependencies, function (...dependencyMods) {
            exports = factory.apply(null, dependencyMods);
        });
        return exports;
    })
    callback.apply(null, loadedModNames);
}
