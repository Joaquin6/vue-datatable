/* eslint-disable no-console */
import { PERSONA_WEBSITES } from '@utils/consts';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import uniqBy from 'lodash/uniqBy';
import Vue from 'vue';
import browser from 'webextension-polyfill';
import * as types from './mutation-types';

const collectConnections = (sites = []) => sites.map(connection => {
    const website = connection.website || {};

    if (connection.website) {
        website.login = {
            id: connection.hash,
            login_identifier: connection.login_identifier,
            credential: {
                id: website.id,
                hash: connection.id,
                login_identifier: connection.login_identifier,
            },
        };

        website.favicon_url = `https://www.google.com/s2/favicons?domain=${website.name}`;
    }

    if (connection.login) {
        website.login = connection.login;
    }

    if (connection.id) {
        website.login_credential_id = connection.id;
    }

    return website;
});

export default {
    async [types.SET_CONNECTIONS](state, data) {
        const { persona_websites: storedConnections = [] } = await browser
            .storage.local.get(PERSONA_WEBSITES);
        const sites = data === false ? [] : data;
        const websites = isArray(sites) ? { add: sites } : sites;
        const addConnections = collectConnections(websites.add);
        const updateConnections = collectConnections(websites.update);
        const deletedConnections = collectConnections(websites.deleted);

        let connections = storedConnections
            .filter(({ id }) => !isUndefined(id))
            .concat(addConnections.filter(({ id }) => !isUndefined(id)));

        if (!isEmpty(updateConnections)) {
            connections = connections.map(connection => {
                let updatedConnection;

                if (updateConnections.contains(connection)) {
                    updatedConnection = updateConnections.find(({ login }) => login.id === connection.login.id);
                }

                return updatedConnection ? { ...connection, ...updatedConnection } : connection;
            });
        }

        if (!isEmpty(deletedConnections)) {
            connections = connections.filter(connection => deletedConnections.contains(connection)
                ? false
                : connection
            );
        }

        connections = uniqBy(connections, 'id');

        browser.storage.local.set({ persona_websites: connections });

        Vue.set(state, 'data', connections);
    },
    [types.SET_CONNECTIONS_LOADING](state, toggle) {
        Vue.set(state, 'loading', Boolean(toggle));
    },
    [types.SET_CONNECTIONS_SHOULD_SYNC](state, toggle) {
        Vue.set(state, 'shouldSync', Boolean(toggle));
    },
    [types.SET_CONNECTIONS_SYNCING](state, toggle) {
        Vue.set(state, 'syncing', Boolean(toggle));
    },
    [types.SET_CONNECTIONS_ERROR](state, toggle) {
        Vue.set(state, 'error', Boolean(toggle));
    },
};
