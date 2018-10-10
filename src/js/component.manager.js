'use strict';
const _ = require('lodash');

const Components = require('./components');
const Models = require('./models');

class Manager {
    constructor() {
        this.components = {};
    }

    add(component) {
        this.components[component.model.id] = component;
        if(this.onComponentAdd && typeof this.onComponentAdd === 'function'){
            this.onComponentAdd(component);
        }
    }

    remove(component) {
        if(this.onComponentRemove && typeof this.onComponentRemove === 'function'){
            this.onComponentRemove(component.model.id);
        }
        delete this.components[component.model.id];
    }

    addByType(type, physicalId){
        let model = new Models[type](type, physicalId);
        let Component = Components[model.deviceType];
        let _component = new Component('devices', model);

        _component.onComponentRemove = () =>{
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

    onComponentRemove(){};
    onComponentAdd(){};
    onComponentStateChange(){};


}

module.exports = Manager;