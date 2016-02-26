
var LocationsViewModel = function (mapVm) {

    'use strict';

    /**
     *  Top-level variables and properties for `LocationsViewModel()`
     */
    var vm = this;

    // Initialize the `locationGroups` observable array which will hold objects containing the resulting locations from
    // each `activity` search.
    vm.locationGroups = ko.observableArray();

    // Initialize `filterQuery` observable to bind to user input in the locations filter form.
    vm.filterQuery = ko.observable('');

    // Initialize an empty observable array to hold locations whose names contain the filter query.
    vm.filteredResults = ko.observableArray();

    // Initialize an observable to store the `applyFilter` state which will be used to to toggle the css `display`
    // property ("visible" or "hidden") of the "all-location-results" and "filtered-location-results" divs.
    vm.applyFilter = ko.observable(false);


    /**
     *  Activity locations search function
     */
    vm.searchActivityLocations = function (activity) {

        var mapBounds = mapVm.mapCopy.getBounds();

        mapVm.placesService.textSearch({
            bounds: mapBounds,
            query: activity
        }, callback);

        function callback(results, status) {

            if (status === google.maps.places.PlacesServiceStatus.OK &&
                results.length > 0) {

                var visibleLocations = suppressOutOfBoundsLocations(results);

                if (visibleLocations.length > 0) {

                    // Transform the resulting list from Google Places to an object and push to `locationGroups`.
                    vm.locationGroups.push({
                        activity: activity,
                        results: visibleLocations
                    });

                    // Add location markers for resulting places.
                    for (var i = 0, len = visibleLocations.length; i < len; i++) {
                        mapVm.addMarker(visibleLocations[i]);
                    }

                } else {
                    alert('Sorry, there are no locations for that activity in the current map bounds.');
                }

            } else {
                alert('Sorry, there was a problem retrieving results for the following reason: ' + status);
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


    /**
     *  Locations filter function
     */
    vm.filterQuery.subscribe(function filterResults() {

        // If there is no filter input, set the `applyFilter` state to false & display all of the markers again.
        if (vm.filterQuery().trim() === '') {

            vm.applyFilter(false);
            vm.filteredResults([]);

            mapVm.showAllMarkers();

        } else {
            vm.applyFilter(true);

            var removedLocations;

            // I use this JSON hack to prevent the `filteredResults` from mutating the same underlying array that
            // `locationGroups` has a reference to (the array which contains all of the original search results).
            var copy = JSON.parse(ko.toJSON(vm.locationGroups()));

            _.each(copy, function (activity) {

                _.each(activity, function (locations) {

                    // lodash `_.remove()` removes items from each activity's `locations` array ("results" property)
                    // for which the callback function returns `true`, and also returns an array containing the
                    // removed items.
                    removedLocations =_.remove(locations, function (location) {
                        if (location.name) {

                            // Remove the locations that do not contain the filter query substring.
                            return location.name.toLowerCase().indexOf(vm.filterQuery().toLowerCase()) === -1;
                        }
                    });

                    // Remove map markers for filtered-out locations.
                    if (removedLocations) {
                        _.each(removedLocations, function (location) {
                            mapVm.hideMarker(location);
                        });
                    }
                });
            });

            // Set `filteredResults` observable array to the filtered locations array so that the UI gets updated.
            vm.filteredResults(copy);

            // Re-display markers when `backspace` is pressed or input is altered some other way which causes previously
            // filtered-out locations to appear back in the list.
            _.each(vm.filteredResults(), function (activity) {
                _.each(activity.results, function (location) {
                    mapVm.showMarker(location);
                });
            });
        }
    });

    // Hack to prevent page reload on the filter form submission.
    vm.preventDefault = function () {
        // (do nothing.)
    };

};
