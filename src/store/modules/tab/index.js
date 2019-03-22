import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const defaultState = () => ({
    data: [],
    status: false,
    loading: false,
    error: false,
});

export const tab = {
    state: defaultState(),
    actions,
    mutations,
    getters,
};
