import Devtools from '@vue/devtools';
import browser from 'webextension-polyfill';
import Vue from 'vue';

Vue.config.debug = true;
Vue.config.devtools = true;
Vue.config.performance = true;
Vue.config.productionTip = true;

Vue.prototype.$browser = global.browser = window.browser = browser;

export default { Vue, Devtools };
