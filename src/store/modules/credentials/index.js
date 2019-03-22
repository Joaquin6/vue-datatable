import actions from './actions';
import mutations from './mutations';
import getters from './getters';

const defaultState = () => ({
    data: [],
    loading: false,
    error: false,
});

export const credentials = {
    state: defaultState(),
    actions,
    mutations,
    getters,
};
