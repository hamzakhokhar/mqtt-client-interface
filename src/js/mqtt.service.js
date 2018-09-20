'use strict';

const AwsIotSDK = require('aws-iot-device-sdk');
const Config = require('./config');

class Service {
    constructor(){
        this._credentials = null;
        this.client = null;
    }

    connect(credentials){
        this.client = AwsIotSDK.device(this.config);
        this.client.on('connect', (connectEvent) => {
            if (this.onConnect && typeof this.onConnect === 'function'){
                this.onConnect(connectEvent);
            }

        })
    }

    get config() {
        let _config = {};
        Object.assign(_config, Config.iot);
        _config.accessKeyId = this.credentials.AccessKeyId;
        _config.secretKey =  this.credentials.SecretKey;
        _config.sessionToken = this.credentials.SessionToken;
        return _config;
    }

    set credentials(val) {
        this._credentials = val;
    }

    get credentials(){
        return this._credentials;
    }

}

module.exports = Service;