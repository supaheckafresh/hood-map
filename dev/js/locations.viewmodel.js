
var LocationsViewModel = function (mapVm) {

    'use strict';

    var vm = this;

    // Initialize the `locationGroups` observable array which will hold objects containing
    // the resulting locations from each `activity` search.
    vm.locationGroups = ko.observableArray();

    // Initialize `filterQuery` to bind to user input in the locations filter form.
    vm.filterQuery = ko.observable('');


    // TODO: Give search results only for current map boundaries.
    vm.searchActivityLocations = function (activity) {

        var mapBounds = mapVm.mapCopy.getBounds();

        mapVm.placesService.textSearch({
            bounds: mapBounds,
            query: activity
        }, callback);

        function callback(results, status) {

            if (status === google.maps.places.PlacesServiceStatus.OK &&
                results.length > 0) {

                var filteredResults = suppressOutOfBoundsLocations(results);

                if (filteredResults.length > 0) {

                    // Transform the resulting list from Google Places to an object and push to `locationGroups`.
                    vm.locationGroups.push({
                        activity: activity,
                        results: filteredResults
                    });

                    // Add location markers for resulting places.
                    for (var i = 0, len = filteredResults.length; i < len; i++) {
                        mapVm.addMarker(filteredResults[i]);
                    }

                } else {
                    alert('Sorry, there are no locations for that activity in the current map bounds.');
                }

            } else {
                alert('Sorry, there was a problem retreiving results for the following reason: ' + status);
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
    };


    vm.filterQuery.subscribe(function filterResults() {
        var locationGroupsCopy = ko.observableArray(vm.locationGroups());
        vm.filteredResults = ko.observableArray();
        var matches;

        console.log(locationGroupsCopy());

        _.each(locationGroupsCopy(), function (activity) {

            _.each(activity, function (locations) {

                matches = _.remove(locations, function (location) {
                    if (location.name) {
                        return location.name.toLowerCase().indexOf(vm.filterQuery().toLowerCase()) > -1;
                    }
                });

            });

            if (matches.length > 0) {
                vm.filteredResults.push(returnActivity(activity, matches));
            }

            console.log('===============================================');
            console.log('Matches found in: ' + activity.activity);
            console.log(matches);

        });

        function returnActivity(activity, matches) {
            return {
                activity: activity.activity,
                results: matches
            };
        }
        console.log('filtered results below')
        console.log(vm.filteredResults());
    });

    // Hack to prevent form submission on the filter input.
    vm.preventDefault = function () {
    };
};
