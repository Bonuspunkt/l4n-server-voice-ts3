const debug = require('debug')('l4n:server:ts3:repo');
const { EventEmitter } = require('events');

const createTable = `
CREATE TABLE IF NOT EXISTS LobbyTs3 (
    lobbyId INTEGER NOT NULL,
    cid INTEGER NOT NULL,

    FOREIGN KEY(lobbyId) REFERENCES Lobby(id)
);`;

class Ts3Repo extends EventEmitter {
    constructor(resolve) {
        super();

        const db = resolve('db');
        db.exec(createTable);

        this.statements = {
            insertMapping: db.prepare(`
                INSERT INTO LobbyTs3(lobbyId, cid)
                VALUES ($lobbyId, $cid)`),
            byLobbyId: db.prepare(`SELECT * FROM LobbyTs3 WHERE lobbyId = $lobbyId`),
            all: db.prepare(`
                SELECT *
                  FROM LobbyTs3
                 WHERE LobbyId in (SELECT lobbyId FROM LobbyUser WHERE left IS NOT NULL)`),
        };
    }

    insert({ lobbyId, cid }) {
        const { insertMapping } = this.statements;
        insertMapping.run({ lobbyId, cid });

        debug(`lobby ${lobbyId} mapped to ${cid}`);

        this.emit('mapped', { lobbyId, cid });
    }

    byLobbyId(lobbyId) {
        const { byLobbyId } = this.statements;
        return byLobbyId.get({ lobbyId });
    }

    all() {
        const { all } = this.statements;
        return all.all();
    }
}

module.exports = Ts3Repo;
