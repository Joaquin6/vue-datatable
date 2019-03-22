import './plugins/vuetify';
import browser from 'webextension-polyfill';
import { newVueInstance as mountRootVue } from './utils/create-vue-instance';

import Popup from './Popup.vue';

if (browser && browser.tabs) {
    browser.tabs.getSelected(null, tab => {
        mountRootVue(Popup, { host });
    });
}
