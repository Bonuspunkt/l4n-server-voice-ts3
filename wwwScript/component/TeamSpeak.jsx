//import React from 'react';
import PropTypes from 'proptypes';

const TeamSpeak = ({ ts3, lobby, user }) => {
    const ts3Link = `ts3server://${ts3.host}?port=${ts3.port}&cid=${lobby.cid}&nickname=${user.name}`;

    return <a href={ts3Link}>Join TeamSpeak</a>;
};

TeamSpeak.propTypes = {
    ts3: PropTypes.shape({
        host: PropTypes.string,
        port: PropTypes.number,
    }),
};

export default TeamSpeak;
