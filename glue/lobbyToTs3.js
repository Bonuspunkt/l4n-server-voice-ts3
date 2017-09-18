const initRootChannel = async client => {
    let channelList = await client.send('channellist');
    if (!Array.isArray(channelList)) channelList = [channelList];

    const rootChannel = channelList.find(c => c.channel_name === 'l4n');
    if (rootChannel) return rootChannel;

    const createdChannel = await client.send('channelcreate', {
        channel_name: 'l4n',
        //channel_topic: 'l4n root channel',
        //channel_description: 'l4n bla bla bla',
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
    await client.login();
    const rootChannel = await initRootChannel(client);

    const lobbyRepo = resolve('lobbyRepo');

    lobbyRepo.on('create', async lobby => {
        // error_id: 771 => channel exists
        const channel = await client.send('channelcreate', {
            channel_name: lobby.name,
            channel_flag_permanent: 1,
            cpid: rootChannel.cid,
        });
        ts3Repo.insert({ lobbyId: lobby.id, cid: channel.id });
    });

    lobbyRepo.on('destroy', async lobby => {
        const { cid } = ts3Repo.byLobbyId(lobby.id);
        await client.send('channeldelete', { cid, force: 1 });
    });
};
