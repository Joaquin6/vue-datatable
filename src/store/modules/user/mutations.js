import * as types from './mutation-types';

export default {
    [types.SET_LOGGED_IN](state, loggedIn) {
        state.loggedIn = Boolean(loggedIn);
    },
    [types.SET_LOGIN_ERROR](state, error) {
        state.loginError = Boolean(error);
    },
    [types.SET_LOGIN_RETURN_USER](state, profile) {
        state.profile = profile;
    },
};
