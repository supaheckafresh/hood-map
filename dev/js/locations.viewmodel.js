
var LocationsViewModel = function (mapVm) {

    'use strict';

    var vm = this;

    // Initialize the `locationGroups` observable array which will hold objects containing
    // the resulting locations from each `activity` search.
    vm.locationGroups = ko.observableArray();

    // TODO: Give search results only for current map boundaries.
    vm.searchActivityLocations = function (activity) {

        mapVm.placesService.textSearch({
            bounds: mapVm.mapCopy.getBounds(),
            query: activity
        }, callback);

        function callback(results, status) {

            if (results.length > 0) {
                // Transform the resulting list from Google Places to an object and push to `locationGroups`.
                vm.locationGroups.push({
                    activity: activity,
                    results: results
                });
            } else {
                alert('Sorry, there were no results for that activity.');
            }

            // Add location markers for resulting places.
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0, len = results.length; i < len; i++) {
                    console.log(results[i].name);
                    mapVm.addMarker(results[i]);
                }
            }
        }
    };
};
