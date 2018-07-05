const deviceModule = require('aws-iot-device-sdk').device
const TOPICS = {
    UPDATE: 'climate/update'
};

class IotAdaptor {
    constructor(config) {
        this.config = config;
    }

    connect() {
        // create IoT device reference
        this.device = deviceModule({
            keyPath: this.config.privateKey,
            certPath: this.config.clientCert,
            caPath: this.config.caCert,
            host: this.config.host
        });

        // set up listeners
        this.device
            .on('connect', function () {
                console.log('connected');
            });
        this.device
            .on('close', function () {
                console.log('closed');
            });
        this.device
            .on('reconnect', function () {
                console.log('reconnected');
            });
        this.device
            .on('offline', function () {
                console.log('offline');
            });
        this.device
            .on('error', function (error) {
                console.log('error', error);
            });
        this.device
            .on('message', function (topic, payload) {
                console.log('message', topic, payload.toString());
            });

        return new Promise((resolve, reject) => {
            this.device
                .once('connect', function () {
                    resolve();
                });
            this.device
                .once('error', function (error) {
                    reject(error);
                });
        });
    }

    publish(temperature, humidity) {
        let payload = null;

        return new Promise((resolve, reject) => {

            // attempt to stringify
            try {
                payload = JSON.stringify({
                    location: this.config.deviceName,
                    temperature,
                    humidity,
                    timestamp: new Date().getTime()
                });
            } catch (jsonErr) {
                return reject(jsonErr);
            }

            // publish temperature update to AWS IoT topic
            this.device.publish(TOPICS.UPDATE, payload, undefined, (err) => {
                if (err) {
                    reject('failed to submit temperature');
                } else {
                    resolve(payload);
                }
            })
        });
    }
}

module.exports = IotAdaptor;