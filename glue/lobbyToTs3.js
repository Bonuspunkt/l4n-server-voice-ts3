const initRootChannel = async client => {
    let channelList = await client.send('channellist');
    if (!Array.isArray(channelList)) channelList = [channelList];

    const rootChannel = channelList.find(c => c.channel_name === 'l4n');
    if (rootChannel) return rootChannel;

    const createdChannel = await client.send('channelcreate', {
        channel_name: 'l4n',
        channel_flag_maxfamilyclients_unlimited: 0,
        channel_flag_maxclients_unlimited: 0,
        channel_maxClients: 0,
        channel_flag_permanent: 1,
    });

    return createdChannel;
};

module.exports = async resolve => {
    const ts3Repo = resolve('ts3Repo');

    const client = resolve('ts3Client');
    const rootChannel = await initRootChannel(client);

    const lobbyRepo = resolve('lobbyRepo');

    lobbyRepo.on('create', async lobby => {
        const getChannelName = (() => {
            let i = 0;
            return () => {
                const suffix = i ? ` (${i})` : '';
                i++;
                return `${lobby.name}${suffix}`;
            };
        })();

        let channelCreated = false;

        while (!channelCreated) {
            try {
                const { cid } = await client.send('channelcreate', {
                    channel_name: getChannelName(),
                    channel_flag_permanent: 1,
                    cpid: rootChannel.cid,
                });
                channelCreated = true;

                ts3Repo.insert({ lobbyId: lobby.id, cid });
            } catch (e) {
                // error_id: 771 => channel exists
                if (!e || e.error_id !== 771) throw e;
            }
        }
    });

    lobbyRepo.on('destroy', async lobbyId => {
        const { cid } = ts3Repo.byLobbyId(lobbyId);
        await client.send('channeldelete', { cid, force: 1 });
    });
};
