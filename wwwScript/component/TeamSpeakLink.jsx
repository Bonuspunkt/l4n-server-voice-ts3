import React from 'react';
import PropTypes from 'proptypes';

const TeamSpeakLink = ({ ts3, lobby, user }) => {
    if (!lobby.cid) return null;

    if (!lobby.users.includes(user.id)) return null;

    const { host = '', port = '' } = ts3;
    const ts3Link = `ts3server://${host}?port=${port}&cid=${lobby.cid}&nickname=${user.name}`;

    return (
        <a className="button" href={ts3Link}>
            Join TeamSpeak
        </a>
    );
};

TeamSpeakLink.propTypes = {
    ts3: PropTypes.shape({
        host: PropTypes.string,
        port: PropTypes.number,
    }),
};

export default TeamSpeakLink;
