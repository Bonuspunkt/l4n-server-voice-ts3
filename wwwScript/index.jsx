import TeamSpeak from './component/TeamSpeak';

const init = ({ resolve, register }) => {
    const registry = resolve('lobbyActionRegistry');
    registry.add(TeamSpeak);
};

export default init;
