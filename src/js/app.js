'use strict';

const $ = require('jquery');

const imports = require('./imports');
const AuthService = require('./auth.service');
const MqttService = require('./mqtt.service');
const ComponentManager = require('./component.manager');

let sdk = new MqttService();
let componentManager = new ComponentManager();

$('#addDeviceBtn').click(() => {
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
    console.log("client: connected");

    componentManager.onComponentAdd = (component) => {
        console.log('componentAdded', component.model.id);
        //TODO: Subscribe to topics to recieve messages
        sdk.client.subscribe(`$aws/things/${component.model.id}/shadow/update/documents`)
    };

    componentManager.onComponentRemove = (id) => {
        console.log('componentRemoved', id);
        sdk.client.unsubscribe(`$aws/things/${id}/shadow/update/documents`)
    };

    componentManager.onComponentStateChange = (component) => {
      //TODO: send message with new state
        console.log("component: state changed");
        sdk.client.update(component.model.id, {state: component.model.state});
    };

    sdk.client.on('message', (topic, data) => {
       //TODO: Filter message based on the deviceType and update component appropriately
        let _topic = new Topic(topic);
        let payload = JSON.parse(data.toString());

        if(_topic.type  === 'shadow'){
            console.log("client:", JSON.stringify(payload.current.state));
            componentManager.components[_topic.deviceId].model.updateState(payload.current.state);
        }

    });

    sdk.client.on('error', () => {
        console.log(arguments)
    })
};

class Topic {
    constructor(str) {
        this.deviceId = str.split("/")[2];
        this.type = str.split("/")[3] === 'shadow' ? 'shadow' : 'unknown'
    }
}