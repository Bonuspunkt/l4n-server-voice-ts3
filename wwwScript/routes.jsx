import React from 'react';
import lobbyActionRegistry from 'l4n-server/lib/lobbyActionRegistry';
import TeamSpeakLink from './component/TeamSpeakLink';

lobbyActionRegistry.register(props => <TeamSpeakLink key="teamspeak3" {...props} />);

const routes = [];

export default routes;
