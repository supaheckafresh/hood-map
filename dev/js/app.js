(function () {

    'use strict';

    var MapViewModel = function() {
        this.location = ko.observable();

        // Update map and marker whenever a new location search is submitted
        this.location.subscribe(function (searchStr) {
            geo(searchStr);
        });


        var map;
        var geocoder;
        function initMap() {
            console.log('the Google Maps API has been called.');
            geocoder = new google.maps.Geocoder();
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: -34.397, lng: 150.644},
                zoom: 15
            });
        }

        function geo(loc) {
            console.log('new search string: ' + loc);
            geocoder.geocode( { 'address': loc}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    console.log("Geocoding unsuccessful for the following reason: " + status);
                }
            });
        }

        // make initMap() available in the global scope
        window.initMap = initMap;

    };

    // make knockout bindings work:
    ko.applyBindings(new MapViewModel());

}());