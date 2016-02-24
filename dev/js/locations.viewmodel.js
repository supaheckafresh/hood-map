
var LocationsViewModel = function (mapVm) {

    'use strict';

    var vm = this;

    // Initialize `locationGroups` which will hold other lists of activity search results (list-of-lists)
    vm.locationGroups = ko.observableArray();

    // TODO: Give search results only for current map boundaries.
    vm.searchActivityLocations = function (activity) {

        mapVm.placesService.textSearch({
            bounds: mapVm.map.getBounds(),
            query: activity
        }, callback);

        function callback(results, status) {

            if (results.length > 0) {
                vm.locationGroups.push({
                    activity: activity,
                    results: results
                });
            } else {
                alert('Sorry, there were no results for that activity.');
            }

            console.log(vm.locationGroups());

            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0, len = results.length; i < len; i++) {
                    mapVm.addMarker(results[i]);
                }
            }
        }
    };
};
