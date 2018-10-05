'use strict';
const _ = require('lodash');

const Components = require('./components');

class Manager {
    constructor() {
        this.components = {};
    }

    add(component) {
        let id = `${component._model.deviceType}_${component._model.physicalId}`;
        this.components[id] = component;
        if(this.onComponentAdd && typeof this.onComponentAdd === 'function'){
            this.onComponentAdd(id);
        }
    }

    remove(component) {
        let id = `${component._model.deviceType}_${component._model.physicalId}`;
        delete this.components[id];
        if(this.onComponentRemove && typeof this.onComponentRemove === 'function'){
            this.onComponentRemove(id);
        }
    }

    addByType(deviceType, physicalId){
        let _component = Components[deviceType];
        this.add(new _component('devices', {deviceType, physicalId}));
    }

    render() {
        _.forIn(this.components, function(component, id) {
            component.render();
        });
    }

    onComponentRemove(){};
    onComponentAdd(){};


}

module.exports = Manager;