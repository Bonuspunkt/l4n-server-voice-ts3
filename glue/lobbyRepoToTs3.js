const debug = require('debug')('l4n:server:ts3:glue:lobbyRepoToTs3');

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
    const lobbyRepo = resolve('lobbyRepo');
    const ts3Client = resolve('ts3Client');
    const ts3Repo = resolve('ts3Repo');
    const rootChannel = await initRootChannel(ts3Client);

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
                const channelName = getChannelName();
                const { cid } = await ts3Client.send('channelcreate', {
                    channel_name: channelName,
                    channel_flag_permanent: 1,
                    cpid: rootChannel.cid,
                });
                channelCreated = true;

                debug(`created '${channelName}' - cid '${cid}'`);

                ts3Repo.insert({ lobbyId: lobby.id, cid });
            } catch (e) {
                // error_id: 771 => channel exists
                if (!e || e.error_id !== 771) throw e;
            }
        }
    });

    lobbyRepo.on('destroy', async lobbyId => {
        const { cid } = ts3Repo.byLobbyId(lobbyId) || {};
        if (!cid) {
            return debug(`lobby '${lobbyId}' has no mapped channel`);
        }

        debug(`deleted cid '${cid}' - lobbyId '${lobbyId}'`);

        await ts3Client.send('channeldelete', { cid, force: 1 });
    });
};
