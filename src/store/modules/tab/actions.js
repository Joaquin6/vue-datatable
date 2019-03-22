/* eslint-disable no-console */
import consts from '@utils/consts';
import browser from 'webextension-polyfill';
import * as types from './mutation-types';

export default {
    getStatus: async function func({ commit }) {
        const tab = await browser.runtime.sendMessage({
            type: consts.tabs.STATUS,
        });

        commit(types.SET_TAB_STATUS, tab);
    },
    confirm: async function func({ commit }) {
        const confirmation = await browser.runtime.sendMessage({
            type: consts.tabs.CONFIRM,
        });

        commit(types.SET_TAB_CONFIRM, confirmation);
    },
    dismiss: async function func({ commit }) {
        const dismissal = await browser.runtime.sendMessage({
            type: consts.tabs.DISMISS,
        });

        commit(types.SET_TAB_DISMISS, dismissal);
    },
};
