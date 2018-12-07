'use strict';

const $ = require('jquery');
const mustache = require('mustache');
const chart = require('chart.js');

const Component = require('./component');

class TempSensorComponent extends Component {
    constructor(rootElement, model){
        super(rootElement, model);
        this.model.onStateReportedChange = (reportedState) => {
            this.render();
        };

        this.model.onStateDesiredChange = (desiredState) => {
            if(desiredState && desiredState.samplerState && desiredState.samplerState === 'active'){
                let samplerState = desiredState.samplerState === 'active';
                $(this.compiledTemplate).find("#sensorStateCheckBox").prop('checked', samplerState);
            }
        }
    }

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
                <input id="sensorStateCheckBox" type="checkbox" name="Sensor State" value="" > Sensor Active
                <canvas id="myChart" width="400" height="400"></canvas>
            <div class="card-footer">
                <button type="button" class="btn btn-danger float-right" id="123Remove">Remove</button>
            </div>
         </div>`
    }

    onRenderComplete(){
        $(this.compiledTemplate).find("button").click(() => {
            this.remove();
        });

        if(this.model.state.desired.samplerState){
            let samplerState = this.model.state.desired.samplerState === 'active';
            $(this.compiledTemplate).find("#sensorStateCheckBox").prop('checked', samplerState);
        }

        $(this.compiledTemplate).find("#sensorStateCheckBox").change(() => {
            let state = $(this.compiledTemplate).find("#sensorStateCheckBox").prop('checked') ? 'active': 'inactive';
            this.model.updateDesiredState({
                samplerState: state
            });
            if(this.onStateChange && typeof this.onStateChange === 'function'){
                this.onStateChange();
            }
        });

        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets:[
                    {
                        label: "Temperature",
                        data: this.model.timeseries.temperature,
                        fill: false,
                        backgroundColor: "#FF0000",
                        borderColor: "#FF0000",
                    }, {
                        label: "Humidity",
                        data: this.model.timeseries.humidity,
                        fill: false,
                        backgroundColor: "#0000FF",
                        borderColor: "#0000FF",
                    }
                ]

            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        display: true,
                        type: 'linear',
                        scaleLabel: {
                            display:true,
                            labelString: 'Value'
                        },
                        ticks: {
                            suggestedMax: 35,
                            suggestedMin: 0,
                        }
                    }],
                    xAxes: [{
                        type: 'time',
                        distribution: 'series',
                        display:true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }]
                }
            }
        });
    }

    remove(){
        this.destroy();
    }
}

module.exports = TempSensorComponent;
