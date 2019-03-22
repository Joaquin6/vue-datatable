import { Vue, Devtools } from './linking';
import store from '../store';
import { NODE_ENV as environment } from '@api';

const newVueInstance = (component, data = {}) => {
    const div = document.createElement('div');
    const { components } = component;

    div.setAttribute('id', component.name);

    document.body.appendChild(div);

    const instance = new Vue({
        el: `#${component.name}`,
        store,
        components,
        data,
        render: h => h(component),
    });

    if (environment === 'development') {
        Devtools.connect();
    }

    return instance;
};

export {
    newVueInstance,
};
