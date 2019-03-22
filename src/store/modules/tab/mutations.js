/* eslint-disable no-console */
import Vue from 'vue';
import * as types from './mutation-types';

export default {
    [types.SET_TAB_STATUS](state, tab) {
        Vue.set(state, 'status', tab);
    },
    [types.SET_TAB_CONFIRM](state, confirm) {
        if (confirm) {
            // dismisses UI and tells background to kill status, confirm state
            // console.log('confirmation', confirm);
        } else {
            // Something may have gone wrong
            // console.error('confirmation failed');
        }
    },
    [types.SET_TAB_DISMISS](state, dismiss) {
        if (dismiss) {
            // dismisses UI and tells background to kill status
            // console.log('dismissal', dismiss);
        } else {
            // Something may have gone wrong
            // console.error('dismissal failed');
        }
    },
};
