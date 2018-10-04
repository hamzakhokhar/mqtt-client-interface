'use strict';

const $ = require('jquery');
const mustache = require('mustache');

class Component {
    constructor(rootElement, model){
        this._rootElement = $(`#${rootElement}`);
        this._model = model;
    }

    render(){
        this._rootElement.find(`#${this._model.deviceType}_${this._model.physicalId}`).remove();
        this._rootElement.append(this._compile());
    }

    destroy(){
        this._rootElement.find(`#${this._model.deviceType}_${this._model.physicalId}`).remove();
    }

    get template() {
        return ``
    }

    _compile(){
        return mustache.to_html(this.template, this._model);
    }

}

module.exports = Component;