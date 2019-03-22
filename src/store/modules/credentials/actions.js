import types from './mutation-types';
import { captureException } from '@utils/errors';
import { localStorageRemove, retrieveUserCredentials } from '@storage/datastore';

export default {
    async getCredentials({ commit }, host = '') {
        try {
            const logins = await retrieveUserCredentials(host);

            commit(types.GET_CREDENTIALS, logins || []);
        } catch (error) {
            captureException('actions', 'credentials', error);
        }
    },

    async removeCredentials({ commit }, host = '') {
        try {
            await localStorageRemove(host);

            commit(types.GET_CREDENTIALS, []);
        } catch (error) {
            captureException('actions', 'credentials', error);
        }
    },
};
