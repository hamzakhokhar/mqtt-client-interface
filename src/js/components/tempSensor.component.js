'use strict';

const $ = require('jquery');
const mustache = require('mustache');

const Component = require('./component');

class TempSensorComponent extends Component {
    constructor(rootElement, model){
        super(rootElement, model);
        this.model.onStateUpdate = ()=>{
            this.render();
        }
    }
    //
    get template(){
        return `<div class="card" id="{{id}}">
            <div class="card-header">
               <div>
                DeviceType: {{deviceType}}
               </div>
               <div>
                 PhysicalId: {{physicalId}}
               </div>
               <div>
                 deviceId: {{id}}
               </div>
            </div>
            <div class="card-body">
                <h1>Temperature: {{state.reported.temperature}}°C</h1>
                <h1>Humidity: {{state.reported.humidity}}%</h1>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-danger float-right" id="123Remove">Remove</button>
            </div>
         </div>`
    }

    onRenderComplete(){
        $(this.compiledTemplate).find("button").click(() => {
            this.remove();
        });

        $(this.compiledTemplate).find("input").change(() => {
            if (this.onStateChange && typeof this.onStateChange === 'function'){
                this.onStateChange();
            }
        })
    }

    remove(){
        this.destroy();
    }


}


module.exports = TempSensorComponent;
