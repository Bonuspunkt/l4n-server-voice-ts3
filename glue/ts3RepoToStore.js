module.exports = resolve => {
    const { ts3: { host, voicePort } } = resolve('settings');

    const ts3Repo = resolve('ts3Repo');

    const store = resolve('publicStore');
    store.dispatch(state => {
        const maps = ts3Repo.all().map(({ lobbyId, cid }) => ({ [lobbyId]: cid }));
        const mappings = Object.assign({}, ...maps);

        return {
            ...state,
            ts3: { host, voicePort },
            lobbies: state.lobbies.map(lobby => ({
                ...lobby,
                cid: mappings[lobby.id],
            })),
        };
    });

    ts3Repo.on('mapped', ({ lobbyId, cid }) => {
        store.dispatch(state => ({
            ...state,
            lobbies: state.lobbies.map(lobby => {
                return lobby.id !== lobbyId ? lobby : { ...lobby, cid };
            }),
        }));
    });
};
