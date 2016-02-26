
var MapViewModel = function() {
    'use strict';

    var vm = this;

    vm.readyState = ko.observable(false);

    // Default location
    var longBeachCA = {
        searchStr: 'Long Beach, CA',
        center: {lat: 33.770, lng: -118.194}
    };

    // initialize map and infoWindow variables.
    var map;
    var infoWindow;

    // Initialize `location` observable with a default location text to appear in the `searchActivityLocations` input.
    vm.locationName = ko.observable(longBeachCA.searchStr);

    // Initialize an empty object to store the current location.
    vm.currentLocation = {};

    // Initialize an empty list to hold map markers for activity locations.
    vm.markers = [];

    // Update the map and center marker when a new location query in `searchActivityLocations` is performed successfully.
    vm.updateLocation = function () {
        // TODO: Validate input
        vm.geo(vm.locationName());
    };


    /***
     * Google Maps API calls
     */

    var geocoder;
    vm.initMap = function() {
        
        // Initialize the `geocoder`.
        geocoder = new google.maps.Geocoder();
        
        // Initialize the `map`.
        map = new google.maps.Map(document.getElementById('map'), {

            // Hard code downtown Long Beach, CA coordinates.
            center: longBeachCA.center,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        console.log('Google Maps API has been called.');

        // Invoke geo() in order to display marker on pageload.
        vm.geo(longBeachCA.searchStr);

        // Initialize infoWindow.
        infoWindow = new google.maps.InfoWindow();

        // Initialize Places searchActivityLocations.
        vm.placesService = new google.maps.places.PlacesService(map);

        if (vm.placesService) {
            console.log('Google Places service has been initialized.');
        } else {
            console.log('There was an error initializing Google Places service.');
        }

        google.maps.event.addListenerOnce(map, 'idle', function () {
            vm.readyState(true);
            console.log('Google Maps has loaded successfully.');
        });


        // For some reason, setting the `Map()` object to `vm.map` doesn't work well as the map fails to display
        // sometimes (without providing any errors). Store the `map` into `vm.mapCopy` property so that other
        // ViewModels can access the map properties when needed.
        vm.mapCopy = map;

    };


    vm.geo = function (loc) {
        geocoder.geocode( { 'address': loc}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);

                // Store the successfully geocoded location.
                vm.currentLocation = {
                    center: {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    },
                    zoom: 15
                };

                console.log('Location has been set to: ' + loc);

            } else {
                alert("Geocoding was unsuccessful for the following reason: " + status);
            }
        });
    };


    vm.addMarker = function (place) {

        var marker = new google.maps.Marker({
            map: map,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id,
            animation: google.maps.Animation.DROP
        });

        var thatMarker;
        // TODO: figure out why infoWindows aren't working for all of the markers.
        (function (markerCopy) {
            google.maps.event.addListener(markerCopy, 'click', function() {

                thatMarker = this;

                attachInfoWindow();

                toggleAnimation();
            });
        })(marker);

        function attachInfoWindow() {
            infoWindow.setContent(place.name);
            infoWindow.open(map, thatMarker);
        }

        function toggleAnimation() {
            if (thatMarker.getAnimation() !== null) {
                thatMarker.setAnimation(null);
            } else {
                thatMarker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    // Turn off animation after short time.
                    toggleAnimation();
                }, 2125);
            }
        }

        vm.markers.push(marker);
    };

    vm.showAllMarkers = function () {
        _.each(vm.markers, function (marker) {
            marker.setMap(map);
        });
    };

    vm.hideMarker = function (place) {
        _.each(vm.markers, function (marker) {
            if (marker.id === place.place_id) {
                marker.setMap(null);
            }
        });
    };

    vm.showMarker = function (place) {
        _.each(vm.markers, function (marker) {

            // The second conditional checks if the marker is not already present on the map (without this the markers
            // appear to blink/refresh in response to filter input).
           if (marker.id === place.place_id && marker.map != map) {
               marker.setMap(map);
           }
        });
    };

    // make `initMap()` and `MapViewModel` available in the `global` scope (and `MapViewModel()` available to `MasterViewModel()`).
    window.initMap = vm.initMap;

};