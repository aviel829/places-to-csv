var apiKeyAviel = "AIzaSyDNbAinVPOq1a-CtsJ4MMvJwkSYR-JVbY4";
var googlePlaces = require('googleplaces')(apiKeyAviel, 'json');
var Q = require("q");

function getPlaceDetails(placeId) {
    var def = Q.defer();
    var parameters = {
        reference: placeId
    };

    googlePlaces.placeDetailsRequest(parameters, function (error, response) {
        if (error || !response || !response.result) {
            def.reject(error);
            return;
        }

        var result = response.result;

        var placeDetails = {
            'name': result.name,
            'id': placeId,
            'phone': result.international_phone_number,
            'website': result.website,
            'address': result.formatted_address
        };

        def.resolve(placeDetails);

    });

    return def.promise;
}

function getPlaces(query) {
    var def = Q.defer();

    parameters = {
        query: query
    };

    googlePlaces.textSearch(parameters, function (error, response) {
        if (error || !response || !response.results) {
            def.reject(error);
            return;
        }

        var items = [];

        response.results.forEach(function (place) {
            var item = {
                'name': place.name,
                'id': place.reference
            };

            items.push(item);
        });

        def.resolve(items);

    });
    return def.promise;


}



module.exports = {
    getPlaces : getPlaces,
    getPlaceDetails : getPlaceDetails
};