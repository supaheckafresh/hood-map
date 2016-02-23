
var MapViewModel = function() {
    'use strict';

    var vm = this;

    var defaultLocation = {
        searchStr: 'Long Beach, CA',
        center: {lat: 33.770, lng: -118.194}
    };

    // initialize Map, InfoWindow, and currentLocation.
    var map;
    vm.currentLocation = {};
    var infoWindow;
    var placesService;

    // Initialize `location` observable with the default location text in search input.
    vm.locationName = ko.observable(defaultLocation.searchStr);

    // Initialize an empty list to hold map markers for activities.
    vm.markers = [];

    // Update the map and marker whenever a new location search is submitted.
    vm.updateLocation = function () {
        // TODO: Validate input
        vm.geo(vm.locationName());
    };


    /***
     * Google Maps API calls
     */

    var geocoder;
    vm.initMap = function() {
        console.log('the Google Maps API has been called.');
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {

            // Hard code downtown Long Beach, CA coordinates.
            center: defaultLocation.center,
            zoom: 15
        });

        // Invoke geo() in order to display marker on pageload.
        vm.geo(defaultLocation.searchStr);

        // Initialize infoWindow.
        infoWindow = new google.maps.InfoWindow();

        // Initialize Places search.
        placesService = new google.maps.places.PlacesService(map);
        console.log('Google Places service initialized: ' + placesService);
    };


    vm.geo = function (loc) {
        console.log('new search string: ' + loc);
        geocoder.geocode( { 'address': loc}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                vm.markers.push(new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                }));

                // Store the successfully geocoded location.
                vm.currentLocation = {
                    center: {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    },
                    zoom: 15
                };
                console.log(vm.currentLocation);

            } else {
                console.log("Geocoding was unsuccessful for the following reason: " + status);
            }
        });
    };

    vm.search = function (activity) {
        console.log(placesService);

        placesService.nearbySearch({
            location: vm.currentLocation.center,
            radius: 500,
            types: [activity]
        }, callback);

        function callback(results, status) {
            console.log('callback status: ' + status);
            console.log('callback results: ' + results);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0, len = results.length; i < len; i++) {
                    console.log('success: ' + results[i]);
                }
            }
        }
    };

    vm.addMarker = function (activity) {
        console.log('Updating activities markers with: ' + activity);

        var marker;

        marker = new google.maps.Marker({
            position: {lat: -25.363, lng: 131.044},
            map: map,
            title: activity
        });

        vm.markers.push(marker);
    };

    // make `initMap()` and `MapViewModel` available in the `global` scope (and `MapViewModel()` available to `MasterViewModel()`).
    window.initMap = vm.initMap;

};