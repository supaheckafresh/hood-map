
var MapViewModel = function() {
    'use strict';

    /**
     * Top-level variables and properties for `MapViewModel()`
     */
    var vm = this;

    // Initialize `map`, `infoWindow`, and `geocoder` variables which are needed in our `initMap()` callback function.
    var map;
    var geocoder;
    var infoWindow;

    // `readyState` is set to `true` inside the `initMap()` function only when the map is in `idle` state (indicating
    // that it has successfully loaded), and also once Google Places Service is initialized. `ActivitiesViewModel`
    // listens for a change to `readyState` in order to execute the default activities Google Places query (otherwise
    // the search executes before the map and Places Service are fully initialized & we'll see errors).
    vm.readyState = ko.observable(false);

    // Default location
    var longBeachCA = {
        searchStr: 'Long Beach, CA',
        center: {lat: 33.770, lng: -118.194}
    };

    // Initialize `locationName` observable with a default location text to appear in the location search input.
    vm.locationName = ko.observable(longBeachCA.searchStr);

    // Initialize an empty object to store the current location.
    vm.currentLocation = {};

    // Initialize an empty list to hold map markers for activity locations.
    vm.markers = [];


    /***
     * Google Maps API calls
     */

    // Update the map when a new location query is performed successfully.
    vm.updateLocation = function () {
        // TODO: Validate input
        vm.geo(vm.locationName());
    };

    // Initialize our map. This is the callback function parameter in our Google Maps API request in 'index.html'.
    vm.initMap = function() {
        
        // Initialize the `map`.
        map = new google.maps.Map(document.getElementById('map'), {

            // Hard code downtown Long Beach, CA coordinates.
            center: longBeachCA.center,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        console.log('Google Maps API has been called.');

        // Initialize the `geocoder`.
        geocoder = new google.maps.Geocoder();

        // Initialize infoWindow.
        infoWindow = new google.maps.InfoWindow();

        // Initialize Places Service.
        vm.placesService = new google.maps.places.PlacesService(map);

        if (vm.placesService) {
            console.log('Google Places service has been initialized.');

            // Set `readyState` property to `true` once Places Service is available and the map has loaded successfully.
            google.maps.event.addListenerOnce(map, 'idle', function () {
                if (map.center) {
                    vm.readyState(true);
                    console.log('Google Maps has loaded successfully.');
                } else {
                    alert('There was a problem loading the map.');
                }
            });

        } else {
            alert('There was an error initializing Google Places service.');
        }

        // Setting the `map` object to `vm.map` doesn't work well as the map fails to display occasionally (without
        // providing any errors). Store the `map` into `vm.mapCopy` property so that other ViewModels can access the
        // map properties when needed.
        vm.mapCopy = map;

    };


    vm.geo = function (locationName) {
        geocoder.geocode( { 'address': locationName }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);

                // Update mapCopy.
                vm.mapCopy = map;

                // Store the successfully geocoded coordinates.
                vm.currentLocation = {
                    center: {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    }
                };

                console.log('Location has been set to: ' + locationName);

            } else {
                alert("Geocoding was unsuccessful for the following reason: " + status);
            }
        });
    };


    /**
     *  Map marker methods
     */
    vm.addMarker = function (location) {

        var marker = new google.maps.Marker({
            map: map,
            title: location.name,
            position: location.geometry.location,
            id: location.place_id,
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
            infoWindow.setContent(location.name);
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
            if (marker.map != map) {
                vm.dropAnimateMarker(marker);
            }
        });
    };

    vm.hideMarker = function (location) {
        _.each(vm.markers, function (marker) {
            if (marker.id === location.place_id) {
                marker.setMap(null);
            }
        });
    };

    vm.showMarker = function (location) {
        _.each(vm.markers, function (marker) {

            // The second conditional checks if the marker is not already present on the map (without this the markers
            // appear to blink/refresh in response to filter input).
           if (marker.id === location.place_id && marker.map != map) {
               vm.dropAnimateMarker(marker);
           }
        });
    };

    vm.dropAnimateMarker = function (marker) {

        // Marker visibility set to hidden temporarily in an effort to improve the appearance of the drop animation.
        marker.setVisible(false);
        marker.setMap(map);
        setTimeout(function () {
            marker.setVisible(true);
            marker.setAnimation(google.maps.Animation.DROP);
        }, 100);
    };

    // make `initMap()` and `MapViewModel` available in the `global` scope (and `MapViewModel()` available to
    // `MasterViewModel()`).
    window.initMap = vm.initMap;

};