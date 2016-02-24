
var LocationsViewModel = function (mapVm) {

    'use strict';

    var vm = this;

    vm.searchActivityLocations = function (activity) {

        mapVm.placesService.textSearch({
            location: mapVm.currentLocation.center,
            radius: '500',
            query: activity
        }, callback);

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0, len = results.length; i < len; i++) {
                    mapVm.addMarker(results[i]);
                }
            }
        }
    };
};
