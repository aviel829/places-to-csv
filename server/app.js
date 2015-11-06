var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var morgan = require('morgan');
var Q = require('q');
var Places = require("./places.js");
var common = require("./common.js");

var server = http.createServer(app);


var bodyParser = require('body-parser');

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

app.use(morgan('combined'));


app.get('/', function (req, res) {
    var htmlFilePath = path.resolve(path.join(__dirname, '..', 'client', 'index.html'));
    res.sendFile(htmlFilePath);
});

app.use('/static/', express.static(path.join(__dirname, '..', 'client', 'static')));

function getPlaces(query) {
    var def = Q.defer();

    console.log('going to fetch query', query);

    Places.getPlaces(query)
        .then(function (places) {
            console.log('got places', query);

            var promises = [];

            places.forEach(function (place) {
                console.log('got place details', query);
                promises.push(Places.getPlaceDetails(place.id));
            });

            Q.all(promises).then(def.resolve, def.reject);

        }, def.reject);

    return def.promise;
}

app.post('/api/places', function (req, res) {

    var queriesJson = req.body.queries;
    var queries = JSON.parse(queriesJson);

    var promises = [];
    queries.forEach(function (query) {
        promises.push(getPlaces(query));
    });

    Q.all(promises).then(function (results) {

        /*
         [query1, query2, query3]
         [[{id:1, name:'asd'}, {id:2, name:'asd2'}], [{id:1, name:'asd'}, {id:2, name:'asd3'}]]

         ->

         [{id:1, name:'asd'}, {id:2, name:'asd2'}, {id:1, name:'asd'}, {id:2, name:'asd2'}, {id:1, name:'asd'}, {id:2, name:'asd2'} , ...]
         */
        var data = [];

        results.forEach(function (result) {
            result.forEach(function (item) {
                data.push(item);
            })
        });

        var fields = ['name', 'phone', 'website', 'address'];

        common.jsonToCSV(fields, data)
            .then(function (csv) {
                res.setHeader('Content-disposition', 'attachment; filename=report.csv');
                res.setHeader('Content-type', 'text/csv');
                res.write(csv);
                res.end();
            });
    }, function (error) {
        console.error(error);
        res.status(500).send('Something broke!');
    });


});

var port = 8080;
server.listen(process.env.PORT || port);
console.log("listen to port", port);

