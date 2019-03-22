export default {
    connections: state => state.data,
    connectionsLoading: state => state.loading,
    connectionsError: state => state.error,
    syncing: state => state.syncing,
    shouldSync: state => state.shouldSync,
};
