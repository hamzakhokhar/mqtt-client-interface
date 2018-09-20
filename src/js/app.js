const imports = require('./imports');
const AuthService = require('./auth.service');
const MqttService = require('./mqtt.service');

let sdk = new MqttService();


AuthService.getCredentials()
    .then((data) => {
       sdk.credentials = data.Credentials;
       sdk.connect();
    });


sdk.onConnect = (connectEvent) => {
    console.log("connected", connectEvent);
};