/*jslint node: true */
'use strict';

var config = require('./config.json');
var weather = require('./ambient-weather');
var homeBase = require('./home-base')(config.temperatureHost, config.temperaturePort);
var getAmbientTemperature = function () {
  return weather.getAmbientTemperature(config.locationName)
    .then(function (data) {
      var str = new Date().toString() + ' temperature: ' + data.temperature + ', humidity: ' + data.humidity;

      console.log(str);
      return homeBase.send(config.deviceName, data.temperature, data.humidity);
    }, function (err) {
      console.log('Error retrieving temperature:', err);
    });
};
var start = function () {
  getAmbientTemperature();
  setTimeout(start, config.requestDelay);
};

start();
