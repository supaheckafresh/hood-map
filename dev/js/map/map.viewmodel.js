
(function () {

    'use strict';

    var MapViewModel = function(foursquareService) {

        /**
         * Top-level variables and properties for `MapViewModel()`
         */
        var vm = this;

        // Initialize `map`, `infoWindow`, and `geocoder` variables which are needed in our `initMap()` callback function.
        window.map = null;
        var geocoder;

        // Initialize empty property to hold the marker info window.
        vm.infoWindow = ko.observable();

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

        // `updateGeolocation()` is the submit function called from the location form in 'searchbar.html.'
        vm.updateGeolocation = function () {
            if (vm.geolocationName().trim() !== '') {
                vm.geo(vm.geolocationName());
            } else {
                vm.geolocationName(vm.cachedgeolocationName());
            }
        };

        // Initialize our map. This is the callback function parameter in our Google Maps API request in 'index.html'.
        window.initMap = function() {

            // Initialize the `map`.
            window.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            });

            console.log('Google Maps API has been called.');

            console.log(google.maps);

            // Initialize the `geocoder`.
            geocoder = new google.maps.Geocoder();
            vm.geo(vm.geolocationName());

            // Initialize the marker info windows.
            vm.initInfoWindow();

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
        };

        window.mapInitErrorHandler = function () {
            console.log();
            alert('There was a problem loading Google Maps.');
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

                    // Reload marker info windows whenever the geolocation changes.
                    vm.initInfoWindow();

                    console.log('Location has been set to: ' + geolocationName);

                } else {
                    vm.geolocationName(vm.cachedgeolocationName());
                    alert("Geocoding was unsuccessful for the following reason: " + status);
                }
            });
        };


        vm.initInfoWindow = function () {

            // Initialize infoWindow, load the template and apply bindings.
            vm.infoWindow(new google.maps.InfoWindow());

            $.ajax('./build/components/infowindow/infowindow.html')
                .done(function (template) {

                    vm.infoWindow().setContent(template);

                    // Opening the info window with the `map` param set to `null` still allows us to perform knockout
                    // data binding (if we had set to `map` we would see an empty info window in the upper-left when the
                    // app starts).
                    vm.infoWindow().open(null);

                    var koBound = false;
                    google.maps.event.addListener(vm.infoWindow(), 'domready', function () {
                        if (koBound === false) {
                            ko.applyBindings(vm, document.getElementById('infowindow-overlay'));
                            koBound = true;
                        }
                    });

                    // When the info window is clicked closed, we lose its knockout binding. When this happens, invoke
                    // `initInfoWindow()` again to make it work upon reopening.
                    google.maps.event.addListener(vm.infoWindow(), 'closeclick', function () {
                        koBound = false;
                        vm.initInfoWindow();
                    });
                });
        };

        // It would be nice if there was an `onclose` event for info windows. Since we sometimes need to close the
        // info window programmatically, as is the case when the selected location is hidden via the filter, or when
        // the activity containing the selected location is unchecked, we need to reset the info window for knockout
        // bindings to work properly.
        vm.resetInfoWindow = function () {
            vm.infoWindow().open(null); // hack. infoWindow.close() was not working for me here.
            vm.initInfoWindow();
        };


        /**
         *  Map orientation methods
         */
        vm.centerMapAt = function (location) {
            var latLng = new google.maps.LatLng(location.geometry().location.lat(),
                                                location.geometry().location.lng());
            map.panTo(latLng);
        };



        // TODO: info window ko binding is lost if info window is closed.
        /**
         *  Map marker methods
         */
        // Changing color of the markers based on foursquare checkins was a bit of an afterthought. Rather than
        // overhaul my code, I opted to get a little messy with passing too many parameters & callback function in
        // order to make this work. Sorry it's a hacky!!
        vm.addMarker = function (location, activity, color) {

            var visibleState = activity().visible() ? map : null;

            var marker = new google.maps.Marker({
                map: visibleState,
                title: location().name(),
                icon: 'build/images/markers/marker_' + color + '.png',
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
            vm.infoWindow().open(map, location.marker);
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

        // TODO: info windows not working after filter performed. I think this may happen when info window is open & gets hidden during filter.
        vm.showMarker = function (location) {
            // Only display the marker if it is not already visible.
            if (location().marker.getMap() != map) {
                vm.dropAnimate(location().marker);
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
    };

    window.MapViewModel = MapViewModel;

})();
