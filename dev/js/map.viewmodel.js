
var MapViewModel = function() {
    'use strict';

    var vm = this;

    var defaultLocation = {
        searchStr: 'Long Beach, CA',
        center: {lat: 33.770, lng: -118.194}
    };

    // Initialize `location` observable with the default location text in search input.
    vm.location = ko.observable(defaultLocation.searchStr);

    // Update the map and marker whenever a new location search is submitted.
    vm.updateLocation = function () {
        // TODO: Validate input
        vm.geo(vm.location());
    };


    /***
     * Google Maps API calls
     */
    var map;
    var geocoder;
    vm.initMap = function() {
        console.log('the Google Maps API has been called.');
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {

            // hardcode downtown Long Beach, CA coordinates
            center: defaultLocation.center,
            zoom: 15
        });

        // invoke geo() in order to display marker on pageload.
        vm.geo(defaultLocation.searchStr);
    };

    vm.geo = function (loc) {
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
    };

    // make `initMap()` and `MapViewModel` available in the `global` scope (and `MapViewModel()` available to `MasterViewModel()`).
    window.initMap = vm.initMap;

};