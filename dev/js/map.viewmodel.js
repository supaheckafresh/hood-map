
var MapViewModel = function(activitiesVm) {
    'use strict';

    var vm = this;

    var defaultLocation = {
        searchStr: 'Long Beach, CA',
        center: {lat: 33.770, lng: -118.194}
    };

    // initialize Map and InfoWindow.
    vm.map = {};
    vm.infoWindow = {};

    // Initialize `location` observable with the default location text in search input.
    vm.location = ko.observable(defaultLocation.searchStr);

    // Initialize an empty list to hold map markers for activities.
    vm.markers = [];

    // Update the map and marker whenever a new location search is submitted.
    vm.updateLocation = function () {
        // TODO: Validate input
        vm.geo(vm.location());
    };


    /***
     * Google Maps API calls
     */

    var geocoder;
    vm.initMap = function() {
        console.log('the Google Maps API has been called.');
        geocoder = new google.maps.Geocoder();
        vm.map = new google.maps.Map(document.getElementById('map'), {

            // Hard code downtown Long Beach, CA coordinates.
            center: defaultLocation.center,
            zoom: 15
        });

        // Initialize infoWindow
        vm.infoWindow = new google.maps.InfoWindow();

        // Invoke geo() in order to display marker on pageload.
        vm.geo(defaultLocation.searchStr);
    };
    

    vm.geo = function (loc) {
        console.log('new search string: ' + loc);
        geocoder.geocode( { 'address': loc}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                vm.map.setCenter(results[0].geometry.location);
                vm.markers.push(new google.maps.Marker({
                    map: vm.map,
                    position: results[0].geometry.location
                }));
            } else {
                console.log("Geocoding was unsuccessful for the following reason: " + status);
            }
        });
    };

    vm.addMarker = function (activity) {
        console.log('Updating activities markers with: ' + activity);

        var marker;

        marker = new google.maps.Marker({
            position: {lat: -25.363, lng: 131.044},
            map: vm.map,
            title: activity
        });

        vm.markers.push(marker);
    };

    // make `initMap()` and `MapViewModel` available in the `global` scope (and `MapViewModel()` available to `MasterViewModel()`).
    window.initMap = vm.initMap;

};