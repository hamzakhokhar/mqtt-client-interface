'use strict';

const Config = require('./config');
const AWS = require('aws-sdk');


class Service {

    static getCredentials() {
        return this._getCredentials()
            .then(() => this._getCredentialsForIdentity())

    }

    static _getCredentials() {
        return new Promise((resolve, reject) => {
            AWS.config.region = Config.cognito.region;
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: Config.cognito.identityPoolId
            });
            AWS.config.credentials.get(function(err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        })
    }

    static _getCredentialsForIdentity() {
        return new Promise((resolve, reject) => {
            var params = {
                IdentityId: AWS.config.credentials.identityId
            };
            new AWS.CognitoIdentity().getCredentialsForIdentity(params, function (err, data) {
                if(err) reject(err);
                else resolve(data);
            });
        })
    }

}


module.exports = Service;
