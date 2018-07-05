/*jslint node: true */
'use strict';

const config = require('./config.json');
const weather = require('./ambient-weather');
const IotAdaptor = require('./lib/IotAdaptor');
const iot = new IotAdaptor(config);

var getAmbientTemperature = function () {
  return weather.getAmbientTemperature(config.locationName)
    .then(function (data) {
      var str = new Date().toString() + ' temperature: ' + data.temperature + ', humidity: ' + data.humidity;

      console.log(str);
      return iot.publish(data.temperature, data.humidity);
    }, function (err) {
      console.log('Error retrieving temperature:', err);
    });
};
var start = function () {
  getAmbientTemperature();
  setTimeout(start, config.pollingInterval);
};

iot.connect()
  .then(() => start())
  .catch((err) => console.error(err));
