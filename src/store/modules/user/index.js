import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export const defaultProfileState = () => ({
    email_address: {},
    profile_picture: {},
});

const defaultState = () => ({
    loggedIn: false,
    loginError: false,
    profile: defaultProfileState(),
});

export const user = {
    state: defaultState(),
    actions,
    mutations,
    getters,
};
