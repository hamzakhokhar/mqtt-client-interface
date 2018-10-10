'use strict';
let uuid = require('uuid-1345');

class TempSensorModel {
    constructor(deviceType, physicalId){
        this.deviceType = deviceType;
        this.physicalId = physicalId;
        this._state = {
            reported : {},
            desired: {}
        }
    }

    toJSON(){}

    toString(){}

    get id(){
        return uuid.v5({
            namespace: uuid.namespace.url,
            name: `${this.deviceType}_${this.physicalId}`
        })
    }

    updateState(state){
        this._state = state;
        if(this.onStateUpdate && typeof this.onStateUpdate === 'function'){
            this.onStateUpdate()
        }
    }

    get state(){
        return this._state;
    }
}

module.exports = TempSensorModel;
