'use strict';
const $ = require('jquery');

class Component {
    constructor(element){
        this._rootElement = element;
    }

    render(){
        $(this._rootElement).html()
    }

    get template () {
        return `<div class="card">
            <div class="card-header">
               DeviceType: {{deviceType}}
               PhysicalId: {{physicalId}}
            </div>
            <div class="card-body">
            </div>
         </div>`
    }

}

module.exports = Component;