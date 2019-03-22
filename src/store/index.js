import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import actions from './actions';
import getters from './getters';
import modules from './modules';
import mutations from './mutations';

Vue.use(Vuex);

const defaultState = () => ({});

const options = {
    state: defaultState(),
    actions,
    getters,
    modules,
    mutations,
    options: {
        devtools: true,
        plugins: [createLogger()],0
    },
};

export default new Vuex.Store(options);
