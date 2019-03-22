import get from 'lodash/get';
import { analytics, user, network } from '@api';
import { captureException } from '@utils/errors';
import { localStorageSave, localLoginStorage } from '@storage/datastore';
import * as events from '@content/analytic-events';
import { PERSONA_LOGGED_IN } from '@utils/consts';
import { defaultProfileState } from './index';
import * as types from './mutation-types';

async function storeLoginDetails({ commit, dispatch }, loginSuccess, data = {}) {
    const { api_token, device_id, user } = data;
    const personaLoggedIn = loginSuccess ? api_token : false;

    try {
        if (personaLoggedIn) {
            await analytics.track(events.USER_LOGGED_IN, data);
        }

        await localLoginStorage.store(personaLoggedIn);
    } catch (error) {
        captureException('actions', 'login', error);
    }

    commit(types.SET_LOGGED_IN, loginSuccess);

    if (!loginSuccess) {
        return false;
    }

    if (typeof user === 'object' && 'id' in user) {
        const returnUser = { persona_returning_user: user.id, persona_device_id: device_id };

        await localStorageSave(returnUser);

        commit(types.SET_LOGIN_RETURN_USER, returnUser);
    }

    await dispatch('connections/setShouldSync', loginSuccess, { root: true });

    return data;
}

export default {
    async getLoggedIn({ commit, getters }) {
        let personaLoggedIn;

        commit(types.SET_LOGIN_ERROR, false);

        try {
            personaLoggedIn = get((await localLoginStorage.fetch()), PERSONA_LOGGED_IN, getters.loggedIn);

            commit(types.SET_LOGGED_IN, personaLoggedIn);
        } catch (error) {
            captureException('actions', 'loggedIn', error);
        }

        return personaLoggedIn;
    },

    async logOutFromPersona({ commit, dispatch }) {
        await storeLoginDetails({ commit, dispatch }, false);
        analytics.track(events.USER_LOGGED_OUT);
    },

    async logInToPersona({ commit, dispatch }, { emailAddress, password }) {
        let data;
        let loginError = false;
        let loginSuccess = true;

        commit(types.SET_LOGIN_ERROR, loginError);

        try {
            ({ data } = await user.login(emailAddress, password));
        } catch (error) {
            loginError = error;
            loginSuccess = false;
            captureException('actions', 'login', error);
        }

        if (loginError
            && (loginError.message.indexOf('Network Error') > -1
                || loginError.message.indexOf('timeout') > -1)) {
            commit('network/SET_NETWORK_STATUS', false, { root: true });
            const retryRequest = await network.getRetryRequest();

            commit('network/SET_RETRY_REQUEST', retryRequest, { root: true });
        }

        await storeLoginDetails({ commit, dispatch }, loginSuccess, data);
    },

    handleLoggedOut({ commit }) {
        commit(types.SET_LOGGED_IN, false);
    },

    async getReturningUser({ commit }) {
        let profile;
        const defaultProfile = defaultProfileState();

        try {
            profile = get((await user.getReturningProfile()), 'data.user', defaultProfile);
        } catch (error) {
            captureException('actions', 'getReturningUser', error);
            profile = defaultProfile;
        }

        commit(types.SET_LOGIN_RETURN_USER, profile);
    },

    async clearReturningUser({ commit }) {
        const defaultProfile = defaultProfileState();

        try {
            await user.clearReturningProfile();
        } catch (error) {
            captureException('actions', 'clearReturningProfile', error);
        }

        commit(types.SET_LOGIN_RETURN_USER, defaultProfile);
    },
};
