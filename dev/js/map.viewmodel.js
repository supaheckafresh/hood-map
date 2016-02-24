
var MapViewModel = function() {
    'use strict';

    var vm = this;

    var defaultLocation = {
        searchStr: 'Long Beach, CA',
        center: {lat: 33.770, lng: -118.194}
    };

    // initialize Map, InfoWindow, and currentLocation.
    var map;
    var infoWindow;
    var placesService;

    // Initialize `location` observable with the default location text in searchActivityLocations input.
    vm.locationName = ko.observable(defaultLocation.searchStr);

    // Initialize an empty object to store current location.
    vm.currentLocation = {};

    // Initialize an empty list to hold map markers for activities.
    vm.markers = [];

    // Update the map and marker whenever a new location searchActivityLocations is submitted.
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

        // Initialize Places searchActivityLocations.
        placesService = new google.maps.places.PlacesService(map);
        if (placesService) {
            console.log('Google Places service has been initialized.');
        } else {
            console.log('There was an error initializing Google Places service.');
        }
    };


    vm.geo = function (loc) {
        console.log('new searchActivityLocations string: ' + loc);
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

            } else {
                console.log("Geocoding was unsuccessful for the following reason: " + status);
            }
        });
    };

    vm.searchActivityLocations = function (activity) {

        placesService.textSearch({
            location: vm.currentLocation.center,
            radius: 1000,
            query: activity
        }, callback);

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0, len = results.length; i < len; i++) {
                    vm.addMarker(results[i]);
                }
            }
        }
    };

    vm.addMarker = function (place) {

        // Added this if statement because I was getting an error in spite of function seeming to work properly:
        // `Uncaught TypeError: Cannot read property 'location' of undefined`
        if(place.geometry) {
            console.log('Updating activities markers with: ' + place.name);

            var marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location
            });

            // TODO: figure out why infoWindows aren't working for all of the markers.
            (function (markerCopy) {
                google.maps.event.addListener(markerCopy, 'click', function() {
                    infoWindow.setContent(place.name);
                    console.log(this);
                    infoWindow.open(map, this);
                });
            })(marker);

            vm.markers.push(marker);
        }
    };

    // make `initMap()` and `MapViewModel` available in the `global` scope (and `MapViewModel()` available to `MasterViewModel()`).
    window.initMap = vm.initMap;

};