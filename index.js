module.exports = ({ resolve, register }) => {
    const Ts3Client = require('./lib/ts3Client');
    const ts3Client = new Ts3Client(resolve);
    register('ts3Client', () => ts3Client);

    const Ts3Repo = require('./lib/ts3Repo');
    const ts3Repo = new Ts3Repo(resolve);
    register('ts3Repo', () => ts3Repo);

    require('./glue/lobbyToTs3')(resolve);
    require('./glue/ts3ToStore')(resolve);
};
