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

    // Triggered when a component is added
    componentManager.onComponentAdd = (component) => {
        console.log('componentAdded', component.model.id);
        //TODO: Subscribe to topics to recieve messages
        sdk.client.subscribe(`$aws/things/${component.model.id}/shadow/update/accepted`);
        sdk.client.subscribe(`$aws/things/${component.model.id}/shadow/get/accepted`, () => {
            sdk.client.publish(`$aws/things/${component.model.id}/shadow/get`, JSON.stringify({}));
        });

    };

    // Triggered when a component is removed
    componentManager.onComponentRemove = (id) => {
        console.log('componentRemoved', id);
        sdk.client.unsubscribe(`$aws/things/${id}/shadow/update/accepted`)
    };

    //Triggered when something is changed on the component itself like a button press or state change
    componentManager.onComponentStateChange = (component) => {
        sdk.client.publish(
            `$aws/things/${component.model.id}/shadow/update`,
            JSON.stringify({state: { desired: component.model.state.desired}})
        );
    };

    // MQTT message handler
    sdk.client.on('message', (topic, data) => {
       //TODO: Filter message based on the deviceType and update component appropriately
        let _topic = new Topic(topic);
        let payload = JSON.parse(data.toString());

        if(_topic.type  === 'shadow'){
            console.log("client:", JSON.stringify(payload.state));
            if(payload.state.reported){
                componentManager.components[_topic.deviceId].model.updateReportedState(payload.state.reported);
            }
            if(payload.state.desired){
                componentManager.components[_topic.deviceId].model.updateDesiredState(payload.state.desired);
            }
        }

    });

    sdk.client.on('error', (err) => {
        console.log(err)
    })
};

class Topic {
    constructor(str) {
        this.deviceId = str.split("/")[2];
        this.type = str.split("/")[3] === 'shadow' ? 'shadow' : 'unknown'
    }
}