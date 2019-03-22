import get from 'lodash/get';
import { connections } from '@api';
import { localLoginStorage } from '@storage/datastore';
import { PERSONA_LOGGED_IN, PERSONA_WEBSITES } from '@utils/consts';
import { captureException } from '@utils/errors';
import browser from 'webextension-polyfill';
import * as types from './mutation-types';

const getConnectionsFromLocalStorage = async ({ connections }, host = false) => {
    if (connections.length > 0) {
        return connections;
    }

    let sites;
    let hostSite;

    try {
        sites = get((await localLoginStorage.fetch(PERSONA_WEBSITES)), PERSONA_WEBSITES, connections);

        hostSite = sites.find(({ name }) => host === name);
    } catch (error) {
        captureException('actions', 'connections', error);
    }

    return host && hostSite ? hostSite : sites;
};

async function requestSyncConnections({ user }, storedConnections) {
    let websites;
    const hashes = {
        website_hashes: storedConnections.map(({ login: { credential } }) => ({
            [credential.id]: credential.hash,
        })),
    };

    try {
        ({ data: { websites } } = await connections.sync({ hashes }));
    } catch (error) {
        if (!user.loggedIn) {
            captureException('actions', 'connections', error);

            throw error;
        }

        websites = storedConnections;
    }

    // eslint-disable-next-line no-console
    console.log('SYNCED CONNECTIONS:', websites);

    return websites;
}

export default {
    async getConnections({ commit, getters }, host = false) {
        commit(types.SET_CONNECTIONS_LOADING, true);
        commit(types.SET_CONNECTIONS_ERROR, false);

        let data;

        try {
            data = await getConnectionsFromLocalStorage(getters, host);

            commit(types.SET_CONNECTIONS, data);
        } catch (error) {
            commit(types.SET_CONNECTIONS_ERROR, true);
            captureException('actions', 'connections', error);
        }

        commit(types.SET_CONNECTIONS_LOADING, false);
    },

    async syncConnections({ commit, dispatch, getters, rootState }, host = false) {
        commit(types.SET_CONNECTIONS_SHOULD_SYNC, true);
        commit(types.SET_CONNECTIONS_ERROR, false);

        try {
            const storedConnections = await getConnectionsFromLocalStorage(getters, host);
            const websites = await requestSyncConnections(rootState, storedConnections);

            commit(types.SET_CONNECTIONS, websites);
        } catch (error) {
            /**
             * TODO: JIRA-WIRE-123 (Network Exception States).
             * TODO: ie: UnauthorizedException, NoInternetException, etc, to show correct vue.
             */
            captureException('actions', 'connections', error);

            await browser.storage.local.remove(PERSONA_LOGGED_IN);

            commit(types.SET_CONNECTIONS, false);
            commit(types.SET_CONNECTIONS_ERROR, true);

            /**
             * @DEPRECATED
             * It should be called only if the status code is 401 Unauthorized.
             * After the above 'to do' is finished, this will have a condition.
             */
            dispatch('user/logOutFromPersona', false, { root: true });
        }

        commit(types.SET_CONNECTIONS_SHOULD_SYNC, false);
        commit(types.SET_CONNECTIONS_SYNCING, false);
    },

    setShouldSync({ commit }, toggle) {
        commit(types.SET_CONNECTIONS_SHOULD_SYNC, toggle);
    },
};
