const AwsIotSDK = require('aws-iot-device-sdk');
const AuthService = require('./auth.service');
const Config = require('./config');
require('../css/app.css');

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