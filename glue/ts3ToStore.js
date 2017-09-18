module.exports = resolve => {
    const { ts3 } = resolve('settings');
    const { host, voicePort } = ts3;

    const ts3Repo = resolve('ts3Repo');
    const mappings = ts3Repo.all();

    const store = resolve('publicStore');
    store.dispatch(state => ({
        ...state,
        ts3: { host, voicePort },
        lobbies: state.lobbies.map(lobby => ({
            ...lobby,
            cid: mappings.find(m => m.lobbyId === lobby.id).cid,
        })),
    }));

    ts3Repo.on('mapped', ({ lobbyId, cid }) => {
        store.dispatch(state => ({
            ...state,
            lobbies: state.lobbies.map(lobby => {
                return lobby.id !== lobbyId ? lobby : { ...lobby, cid };
            }),
        }));
    });
};
