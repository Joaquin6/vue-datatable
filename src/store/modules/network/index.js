import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const defaultState = () => ({
    network: true,
    retryRequest: false,
    updatingNetwork: false,
    waitingOnRequest: false,
});

export const network = {
    state: defaultState(),
    actions,
    mutations,
    getters,
};
