import Vue from 'vue';
import * as types from './mutation-types';

export default {
    [types.SET_NETWORK_STATUS](state, toggle) {
        Vue.set(state, 'network', Boolean(toggle));
    },
    [types.SET_RETRY_REQUEST](state, retryRequest) {
        Vue.set(state, 'retryRequest', retryRequest);
    },
    [types.WAITING_ON_REQUEST](state, toggle) {
        Vue.set(state, 'waitingOnRequest', Boolean(toggle));
    },
    [types.NETWORK_STATUS_UPDATING](state, toggle) {
        Vue.set(state, 'updatingNetwork', Boolean(toggle));
    },
};
