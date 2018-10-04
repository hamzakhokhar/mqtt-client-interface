'use strict';

const $ = require('jquery');
const mustache = require('mustache');

const Component = require('./component');

class TempSensorComponent extends Component {
    constructor(rootElement, model){
        super(rootElement, model)
    }

    get template(){
        return `<div class="card" id="{{deviceType}}_{{physicalId}}">
            <div class="card-header">
               <div>
                DeviceType: {{deviceType}}
               </div>
               <div>
                 PhysicalId: {{physicalId}}
               </div>
            </div>
            <div class="card-body">
            </div>
            <!--<div class="card-footer">-->
                <!--<button type="button" class="btn btn-danger float-right">Remove</button>-->
            <!--</div>-->
         </div>`
    }

}


module.exports = TempSensorComponent;
