'use strict';

const $ = require('jquery');

const imports = require('./imports');
const AuthService = require('./auth.service');
const MqttService = require('./mqtt.service');
const ComponentManager = require('./component.manager');

let sdk = new MqttService();
let componentManager = new ComponentManager();

$('#addButton').click(() => {
    let deviceType = $('#deviceType').val();
    let physicalId = $('#physicalId').val();
    componentManager.addByType(deviceType, physicalId);
    componentManager.render();
});


AuthService.getCredentials()
    .then((data) => {
        console.log(data);
       sdk.credentials = data.Credentials;
       sdk.connect();
    });


sdk.onConnect = (connectEvent) => {


    componentManager.onComponentAdd = (id) => {
        console.log('componentAdded', id)
        //TODO: Subscribe to topics to recieve messages
    };

    componentManager.onComponentRemove = (id) => {
        console.log('componentRemoved');
        //TODO: UnSubscribe to topics
    };

    componentManager.onComponentStateChange = (id, state) => {
      //TODO: send message with new state
        // example sdk.client.publish(`devices/${id}`, JSON.stringify(state));
        // example sdk.client.updateShadow(`${id}`, state...) state needs to be a shadow state not your component state
    };

    sdk.client.on('message', (topic, data) => {
       //TODO: Filter message based on the deviceType and update component appropriately
    });

    sdk.client.on('error', () => {
        console.log(arguments)
    })
};