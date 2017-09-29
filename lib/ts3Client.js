const debug = require('debug')('l4n:server:voice:ts3Client');
const TeamSpeak = require('node-teamspeak-api');

class TS3Client {
    constructor(resolve) {
        const { ts3 } = resolve('settings');
        const { host = 'localhost', queryPort = 10011, login, password, sid = 1 } = ts3;

        let client;

        const send = async (command, params) => {
            if (!client) {
                client = new TeamSpeak(host, queryPort);
                client.on('close', () => {
                    debug('disconnected');
                    client = null;
                });
                await send('login', {
                    client_login_name: login,
                    client_login_password: password,
                });
                await send('use', { sid });
            }
            return new Promise((resolve, reject) => {
                client.send(command, params, (err, resp, req) => {
                    if (err) {
                        debug(err);
                        return reject(err);
                    }
                    resolve(resp.data);
                });
            });
        };

        this.send = send;

        this.close = () => client.disconnect();
    }
}

module.exports = TS3Client;
