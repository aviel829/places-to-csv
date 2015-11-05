var Places = require("./places.js");

/// -----------------------------

Places.getPlaces("serrurier in 75009")
    .then(function (places) {
        places.forEach(function (place) {

            Places.getPlaceDetails(place.id)
                .then(function (details) {
                    var data = [];
                    data.push(details);
                    console.log(data);
                    //console.log(details);
                });
        })
    });

