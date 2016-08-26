/*jslint node: true*/
module.exports = function (host, port) {
  'use strict';

  var q = require('q'),
    http = require('http'),
    httpOptions = {
      hostname: host,
      port: port,
      method: 'GET',
      path: ''
    };

  function send(deviceName, temperature, humidity) {
    var req,
      opts = httpOptions,
      defered = q.defer();
// /temperature/:name/:temperature/:humidity
    opts.path = ['/api/temperature', deviceName, temperature, humidity].join('/');

    req = http.request(opts, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (body) {
        defered.resolve(body);
      });
    });

    req.on('error', function (err) {
      defered.reject(err);
    });

    req.end();

    return defered.promise;
  }

  return {
    send: send
  };
};
