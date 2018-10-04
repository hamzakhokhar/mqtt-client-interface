const imports = require('./imports');
const AuthService = require('./auth.service');
const MqttService = require('./mqtt.service');

const BulbComponent = require('./components/bulb.component');

let sdk = new MqttService();

// let ComponenetManager = new ComponenetManager();
// ComponenetManager.add(new BulbComponent());
//
// ComponenetManager.update();

let bulbComponent = new BulbComponent('devicesComponent');


AuthService.getCredentials()
    .then((data) => {
        console.log(data);
       sdk.credentials = data.Credentials;
       sdk.connect();
    });


sdk.onConnect = (connectEvent) => {
    console.log("connected", connectEvent);


    // sdk.client.publish('test_1', {"hello": "world"})
    //
    sdk.client.on('message', (topic, data) => {
        console.log(topic, data.toString());
    });

    sdk.client.on('error', () => {
        console.log(arguments)
    })

    sdk.client.subscribe('test_1', {}, () => { console.log(arguments)});
};