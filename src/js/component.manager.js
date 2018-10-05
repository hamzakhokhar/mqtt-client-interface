'use strict';
const _ = require('lodash');

const Components = require('./components');

class Manager {
    constructor() {
        this.components = {};
    }

    add(component) {
        let id = `${component.model.deviceType}_${component.model.physicalId}`;
        this.components[id] = component;
        if(this.onComponentAdd && typeof this.onComponentAdd === 'function'){
            this.onComponentAdd(id);
        }
    }

    remove(component) {
        let id = `${component.model.deviceType}_${component.model.physicalId}`;
        delete this.components[id];
        if(this.onComponentRemove && typeof this.onComponentRemove === 'function'){
            this.onComponentRemove(id);
        }
    }

    addByType(deviceType, physicalId){
        let Component = Components[deviceType];
        let _component = new Component('devices', {deviceType, physicalId});

        _component.onComponentRemove = (id) =>{
            this.remove(_component)
        };

        _component.onStateChange = () => {
            if(this.onComponentStateChange && typeof this.onComponentStateChange === 'function'){
                this.onComponentStateChange(_component);
            }
        };

        this.add(_component);
    }

    render() {
        _.forIn(this.components, function(component, id) {
            component.render();
        });
    }

    //TODO: Add update componnent function

    onComponentRemove(){};
    onComponentAdd(){};
    onComponentStateChange(){};


}

module.exports = Manager;