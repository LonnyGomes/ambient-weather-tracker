/*jslint node: true*/
var YQL = require('yql');
var q = require('q');

function getAmbientTemperature(location) {
  'use strict';

  var defer = q.defer(),
    query = new YQL('select item.condition, atmosphere from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '")');

  query.exec(function (err, data) {
    //console.log(data);
    var channel,
      temperature,
      humidity;

    if (err) {
      defer.reject(err);
    } else {
      if (data.query && data.query.results) {
        channel = data.query.results.channel;
        temperature = channel.item.condition.temp;
        humidity = channel.atmosphere.humidity;
        defer.resolve({
          temperature: channel.item.condition.temp,
          humidity: channel.atmosphere.humidity
        });
        //console.log(temperature);
        //console.log(humidity);
      } else {
        defer.reject('Result returned null value');
      }
    }
  });

  return defer.promise;
}

module.exports = {
  getAmbientTemperature: getAmbientTemperature
};
