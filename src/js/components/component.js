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
        this._rootElement.find(`#${this.model.id}`).remove();
        this._rootElement.append(this._compile());
        this.compiledTemplate = this._rootElement.find(`#${this.model.id}`);
        if(this.onRenderComplete && typeof this.onRenderComplete === 'function'){
            this.onRenderComplete(this.compiledTemplate);
        }
    }

    destroy(){
        this._rootElement.find(`#${this.model.id}`).remove();
        if(this.onComponentRemove && typeof this.onComponentRemove === 'function'){
            this.onComponentRemove(`#${this.model.id}`);
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