var express = require('express');
var path = require('path');
var app = express();
var Mta = require('mta-gtfs');

var mtaKey = require('./config').api.mtaKey;

var mta = new Mta({
  key: mtaKey
});

app.use(express.static(path.join(__dirname, './public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/schedule/:id', function (req, res) {
  mta.schedule(req.params.id, function (err, result) {
    res.json(result);
  });
});

app.get('/status/:type', function (req, res) {
  mta.status(req.params.type, function (err, result) {
    res.json(result);
  });
});

var server = app.listen(3005, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});
