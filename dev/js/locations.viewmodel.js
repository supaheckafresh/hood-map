
var LocationsViewModel = function (mapVm) {

    'use strict';

    var vm = this;

    // Initialize the `locationGroups` observable array which will hold objects containing
    // the resulting locations from each `activity` search.
    vm.locationGroups = ko.observableArray();

    // TODO: Give search results only for current map boundaries.
    vm.searchActivityLocations = function (activity) {

        var mapBounds = mapVm.mapCopy.getBounds();

        mapVm.placesService.textSearch({
            bounds: mapBounds,
            query: activity
        }, callback);

        function callback(results, status) {

            if (results.length > 0) {

                var filteredResults = suppressOutOfBoundsLocations(results);

                // Transform the resulting list from Google Places to an object and push to `locationGroups`.
                vm.locationGroups.push({
                    activity: activity,
                    results: filteredResults
                });
            } else {
                alert('Sorry, there were no results for that activity.');
            }

            // Add location markers for resulting places.
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0, len = filteredResults.length; i < len; i++) {

                    mapVm.addMarker(filteredResults[i]);
                }
            }
        }

        function suppressOutOfBoundsLocations(results) {
            var locLat, locLng;
            var inBoundResults = [];
            _.each(results, function (location) {
                locLat = location.geometry.location.lat();
                locLng = location.geometry.location.lng();

                // Store each `location` only if it is contained within the map boundaries at current zoom level.
                if (mapBounds.R.R < locLat && locLat < mapBounds.R.j &&
                    mapBounds.j.R > locLng && locLng > mapBounds.j.j) {

                    inBoundResults.push(location);
                }
            });

            return inBoundResults;
        }
    }
};
