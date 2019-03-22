import Vue from 'vue';
import types from './mutation-types';

export default {
    [types.GET_CREDENTIALS](state, credentials) {
        Vue.set(state, 'data', credentials);
    },
};
