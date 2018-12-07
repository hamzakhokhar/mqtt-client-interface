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
        this.timeseries = {
            temperature: [],
            humidity: []
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

    updateReportedState(reportedState){
        this._state.reported = reportedState;
        if(this.onStateReportedChange && typeof this.onStateReportedChange === 'function'){
            this.onStateReportedChange(reportedState)
        }

        this.timeseries.temperature.push({
            x: new Date(),
            y: this._state.reported.temperature
        })
        this.timeseries.humidity.push({
            x: new Date(),
            y: this._state.reported.humidity
        })
    }

    updateDesiredState(desiredState){
        this._state.desired = desiredState;
        if(this.onStateDesiredChange && typeof this.onStateDesiredChange === 'function'){
            this.onStateDesiredChange(desiredState)
        }
    }

    get state(){
        return this._state;
    }

    onStateReportedChange(){}
    onStateDesiredChange(){}
}

module.exports = TempSensorModel;
