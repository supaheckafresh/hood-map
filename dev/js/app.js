(function () {

    'use strict';

    var MapViewModel = function() {

        var defaultLocation = {
            searchStr: 'Long Beach, CA',
            center: {lat: 33.770, lng: -118.194}
        };

        // Initialize `location` observable with the default location text in search input.
        this.location = ko.observable(defaultLocation.searchStr);

        // Update the map and marker whenever a new location search is submitted.
        this.location.subscribe(function (searchStr) {
            geo(searchStr);
        });


        /***
         * Google Maps API calls
         */
        var map;
        var geocoder;
        function initMap() {
            console.log('the Google Maps API has been called.');
            geocoder = new google.maps.Geocoder();
            map = new google.maps.Map(document.getElementById('map'), {

                // hardcode downtown Long Beach, CA coordinates
                center: defaultLocation.center,
                zoom: 15
            });

            // invoke geo() in order to display marker on pageload.
            geo(defaultLocation.searchStr);
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

                    console.log('lat: ' + map.center.lat() + ' lng: ' + map.center.lng());
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