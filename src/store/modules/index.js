import camelCase from 'lodash/camelCase';

const modules = {};
const requireModule = require.context('./', true, /\.js$/);

requireModule.keys().forEach(fileName => {
    if (fileName === './index.js' || fileName.indexOf('index.js') === -1) {
        return;
    }

    const moduleName = camelCase(fileName.substr(0, fileName.lastIndexOf('/')).split('/').pop());

    modules[moduleName] = {
        namespaced: true,
        ...requireModule(fileName)[moduleName],
    };
});

export default modules;
