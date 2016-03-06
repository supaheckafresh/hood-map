
(function () {

    'use strict';

    var MapViewModel = function() {

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

        // Initialize `geolocationName` observable with a default location text to appear in the location search input.
        vm.geolocationName = ko.observable(longBeachCA.searchStr);
        vm.cachedgeolocationName = ko.observable(longBeachCA.searchStr);

        // Initialize an empty ko.observable object to store the current location.
        vm.currentGeolocation = ko.observable();

        // We will use `locationsVm` as a reference to `LocationsViewModel()`. These properties are used for data
        // binding inside of location info windows.
        vm.locationsVm = {};
        vm.selectedLocation = ko.observable();


        /***
         * Google Maps API calls
         */

        // `updateLocation()` is the submit function called from the location form in 'searchbar.html.'
        vm.updateLocation = function () {
            if (vm.geolocationName().trim() !== '') {
                vm.geo(vm.geolocationName());
            } else {
                vm.geolocationName(vm.cachedgeolocationName());
            }
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

            // Initialize infoWindow, load the template and apply bindings.
            infoWindow = new google.maps.InfoWindow();
            $.ajax('./build/components/infowindow/infowindow.html')
                .done(function (template) {

                    infoWindow.setContent(template);

                    // Opening the info window with the `map` param set to `null` still allows us to perform knockout
                    // data binding (if we had set to `map` we would see an empty info window in the upper-left when the
                    // app starts).
                    infoWindow.open(null);

                    var koBound = false;
                    google.maps.event.addListener(infoWindow, 'domready', function () {
                        if (koBound === false) {
                            ko.applyBindings(vm, document.getElementById('infowindow-overlay'));
                            koBound = true;
                        }
                    });
                });


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


        vm.geo = function (geolocationName) {
            geocoder.geocode( { 'address': geolocationName }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    vm.cachedgeolocationName(geolocationName);

                    map.setCenter(results[0].geometry.location);

                    // Store the successfully geocoded coordinates. LocationsViewModel subscribes to this property in
                    // order to search for new activity locations whenever the map geolocation changes.
                    vm.currentGeolocation({
                        center: {
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng()
                        }
                    });

                    // Update mapCopy.
                    vm.mapCopy = map;

                    console.log('Location has been set to: ' + geolocationName);

                } else {
                    vm.geolocationName(vm.cachedgeolocationName());
                    alert("Geocoding was unsuccessful for the following reason: " + status);
                }
            });
        };


        /**
         *  Map orientation methods
         */
        vm.centerMapAt = function (location) {
            var latLng = new google.maps.LatLng(location.geometry().location.lat(),
                                                location.geometry().location.lng());
            map.panTo(latLng);

            vm.mapCopy = map;
        };


        /**
         *  Map marker methods
         */
        vm.addMarker = function (location, activity) {

            var visibleState = activity().visible() ? map : null;

            var marker = new google.maps.Marker({
                map: visibleState,
                title: location().name(),
                position: location().geometry().location,
                id: location().place_id(),
                animation: google.maps.Animation.DROP});

            (function (markerCopy) {
                google.maps.event.addListener(markerCopy, 'click', function() {

                    vm.locationsVm.selectLocation(location());

                    vm.showInfoWindow(location());
                    vm.bounceAnimate(this);
                });
            })(marker);

            return marker;
        };

        vm.showInfoWindow = function (location) {
            infoWindow.open(map, location.marker);
        };

        vm.showMarkersForVisibleActivities = function (activities) {
            _.each(activities(), function(activity) {
                if (activity().visible() === true) {
                    _.each(activity().results(), function(location) {
                        vm.showMarker(location);
                    });
                }
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
        window.mapCopy = vm.mapCopy;
    };

    window.MapViewModel = MapViewModel;

})();
