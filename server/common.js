var Q = require('q');
var json2csv = require('json2csv');

exports.jsonToCSV = function (fields, data) {

    var def = Q.defer();

    json2csv({data: data, fields: fields}, function (err, csv) {
        if (err) console.log(err);
        def.resolve(csv);
    });

    return def.promise;
};
