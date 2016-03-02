
(function () {

    'use strict';

    var MapViewModel = function(geolocationsVm) {

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

        // Initialize an empty ko.observable object to store the current location.
        vm.currentLocation = ko.observable({});


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

                        // Push default geographic location to `GeolocationsViewModel.geolocations` so that activities
                        // and zoom (and perhaps other states/info to be added later) can be stored and recalled.
                        vm.storeCurrentGeolocation();

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
                    vm.currentLocation({
                        center: {
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng()
                        }
                    });

                    console.log('Location has been set to: ' + locationName);

                    vm.storeCurrentGeolocation();

                } else {
                    alert("Geocoding was unsuccessful for the following reason: " + status);
                }
            });
        };

        /**
         *  Geolocation methods
         */
        vm.storeCurrentGeolocation = function () {
            var geoData = {locationName: vm.locationName, center: map.center, zoom: map.zoom, active: true};
            var geo = ko.observable( new Geolocation(geoData) );

            if (geo()){
                geolocationsVm.currentGeolocation(geo());
                geolocationsVm.geolocations.push(geo());

            } else {
                console.log('There was an error storing the new geolocation');
            }
        };

        vm.updateMap = function () {

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
                animation: google.maps.Animation.DROP});

            var thatMarker;
            // TODO: figure out why infoWindows aren't working for all of the markers.
            (function (markerCopy) {
                google.maps.event.addListener(markerCopy, 'click', function() {

                    thatMarker = this;

                    vm.addInfoWindow(location, markerCopy);
                    vm.bounceAnimate(thatMarker);
                });
            })(marker);

            return marker;
        };

        vm.addInfoWindow = function (location, marker) {
            infoWindow.setContent(location.name);
            infoWindow.open(map, marker);
        };

        vm.showInfoWindow = function (location) {
            infoWindow.setContent(location.name());
            infoWindow.open(map, location.marker);
        };

        vm.showAllMarkers = function (activities) {
            _.each(activities(), function(activity) {
                _.each(activity().results(), function(location) {
                    vm.showMarker(location);
                });
            });
        };

        vm.hideMarker = function (location) {
            location().marker.setMap(null);
        };

        vm.showMarker = function (location) {
            var marker = location().marker;

            // Only display the marker if it is not already visible.
            if (marker.getMap() != map) {
                vm.dropAnimate(marker);
            }
        };

        vm.dropAnimate = function (marker) {
            marker.setMap(map);
            marker.setAnimation(google.maps.Animation.DROP);
        };

        vm.bounceAnimate = function (marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);

            // Turn off animation after short time.
            setTimeout(function () {
                marker.setAnimation(null);
            }, 2125);
        };

        window.initMap = vm.initMap;
    };

    window.MapViewModel = MapViewModel;

})();
