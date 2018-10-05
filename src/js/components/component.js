'use strict';

const $ = require('jquery');
const mustache = require('mustache');

class Component {
    constructor(rootElement, model){
        this._rootElement = $(`#${rootElement}`);
        this.model = model;
        this.compiledTemplate = null;
    }

    render(){
        this._rootElement.find(`#${this.model.deviceType}_${this.model.physicalId}`).remove();
        this._rootElement.append(this._compile());
        this.compiledTemplate = this._rootElement.find(`#${this.model.deviceType}_${this.model.physicalId}`);
        if(this.onRenderComplete && typeof this.onRenderComplete === 'function'){
            this.onRenderComplete(this.compiledTemplate);
        }
    }

    destroy(){
        this._rootElement.find(`#${this.model.deviceType}_${this.model.physicalId}`).remove();
        if(this.onComponentRemove && typeof this.onComponentRemove === 'function'){
            this.onComponentRemove(`#${this.model.deviceType}_${this.model.physicalId}`);
        }
    }

    get template() {
        return ``
    }

    _compile(){
        return mustache.to_html(this.template, this.model);
    }

    onRenderComplete(){}

}

module.exports = Component;