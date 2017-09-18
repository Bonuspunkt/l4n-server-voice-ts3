const TeamSpeak = require('node-teamspeak-api');

class TS3Client {
    constructor(resolve) {
        const { ts3 } = resolve('settings');
        const { host = 'localhost', queryPort = 10011, login, password, sid = 1 } = ts3;

        const tsClient = (this.client = new TeamSpeak(host, queryPort));

        this.send = function(command, params) {
            return new Promise((resolve, reject) => {
                tsClient.send(command, params, (err, resp, req) => {
                    if (err) return reject(err);
                    resolve(resp.data);
                });
            });
        };

        this.login = async () => {
            await this.send('login', {
                client_login_name: login,
                client_login_password: password,
            });
            await this.send('use', { sid });
        };
    }

    close() {
        this.client.disconnect();
    }
}

module.exports = TS3Client;
