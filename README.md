# l4n-server-voice-ts3
- create ServerQuery login
    - Tools > ServerQuery Login
- configure l4n-server

## config
``` js
module.exports = {
    plugins: [
        // ...
        'l4n-server-voice-ts3',
    ],
    // ...
    ts3: {
        host: 'localhost',
        queryPort: 10011,
        voicePort: 9987,
        login: undefined, // use the serverQuery login here
        password: undefined, // use the serverQuery password here,
        sid: 1,
    },
}
```