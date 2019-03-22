import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const defaultState = () => ({
    data: [],
    loading: false,
    error: false,
    syncing: false,
    shouldSync: false,
});

export const connections = {
    state: defaultState(),
    actions,
    mutations,
    getters,
};
