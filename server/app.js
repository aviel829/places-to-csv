var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var Q = require('q');
var Places = require("./places.js");
var common = require("./common.js");

var server = http.createServer(app);

var bodyParser = require('body-parser');

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
    var htmlFilePath = path.resolve(__dirname + "\\..\\client\\index.html");
    res.sendFile(htmlFilePath);
});

app.use('/static/', express.static(path.join(__dirname, '..\\client')));

app.get('/api/places', function (req, res) {

    var query = req.query.query;


    Places.getPlaces(query)
        .then(function (places) {

            var data = [];
            var promises = [];

            places.forEach(function (place) {
                var promise = Places.getPlaceDetails(place.id);
                promises.push(promise);

                promise.then(function (details) {
                    data.push(details);
                });

            });

            Q.all(promises).then(function () {

                var fields = ['name', 'phone', 'website', 'address'];

                common.jsonToCSV(fields, data)
                    .then(function (csv) {

                        res.setHeader('Content-disposition', 'attachment; filename=report.csv');
                        res.setHeader('Content-type', 'text/csv');
                        res.write(csv);
                        res.end();
                    });

            });

        });

});

var port = 8080;
server.listen(process.env.PORT || port);
console.log("listen to port", port);

