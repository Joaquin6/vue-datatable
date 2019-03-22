import { network } from '@api';
import consts from '@utils/consts';
import { captureException } from '@utils/errors';
import * as types from './mutation-types';

export default {
    async getRetryRequest({ commit }) {
        const retryRequest = await network.getRetryRequest();

        commit(types.SET_RETRY_REQUEST, retryRequest);

        return retryRequest;
    },

    setRetryRequest({ commit }, retryRequest = null) {
        network.setRetryRequest({ retryRequest });

        commit(types.SET_RETRY_REQUEST, retryRequest);
    },

    async getNetworkStatus({ commit }) {
        commit(types.NETWORK_STATUS_UPDATING, true);

        let response;

        try {
            response = await network.getStatus();

            if (response.data) {
                response = response.data;
            }

            response = typeof response === 'string'
                ? response === consts.network.CONNECTED : response;
        } catch (error) {
            captureException('actions', 'network', error);
        }

        commit(types.SET_NETWORK_STATUS, response);
        commit(types.NETWORK_STATUS_UPDATING, false);
    },

    setNetworkStatus({ commit }, data = null) {
        const status = typeof data === 'string' ? data === consts.network.CONNECTED : data;

        network.setStatus({ status });
        commit(types.SET_NETWORK_STATUS, status);
    },

    async execRetryRequest({ commit, dispatch }, execRequest) {
        commit(types.WAITING_ON_REQUEST, true);

        try {
            if (execRequest.type === consts.wire.AUTHENTICATION_LOGIN) {
                await dispatch('user/logInToPersona', execRequest.data, { root: true });
            } else {
                await network.execRetryRequest({ execRequest });
            }
        } catch (error) {
            captureException('actions', 'network', error);

            if (error.message.indexOf('Network Error') > -1
                && error.message.indexOf('timeout') > -1) {
                await dispatch('setNetworkStatus', false);
            }
        }

        commit(types.WAITING_ON_REQUEST, false);
    },
};
