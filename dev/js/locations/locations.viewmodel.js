
var LocationsViewModel = function (mapVm) {

    'use strict';

    /**
     *  Top-level variables and properties for `LocationsViewModel()`
     */
    var vm = this;

    // Initialize `filterQuery` observable to bind to user input in the locations filter form.
    vm.filterQuery = ko.observable('');

    // Initialize an observable to store the `applyFilter` state which will be used to to toggle the css `display`
    // property ("visible" or "hidden") of the "all-location-results" and "filtered-location-results" divs.
    vm.applyFilter = ko.observable(false);


    /**
     *  Activity locations search function
     */
    vm.searchLocations = function (activity) {

        var mapBounds = mapVm.mapCopy.getBounds();

        mapVm.placesService.textSearch({
            bounds: mapBounds,
            query: activity().title
        }, callback);

        function callback(results, status) {

            if (status === google.maps.places.PlacesServiceStatus.OK &&
                results.length > 0) {

                var inBoundLocations = suppressOutOfBoundsLocations(results);

                // Check if locations are found inside of visible map boundaries.
                if (inBoundLocations.length > 0) {

                    // Construct `Location` observables and push to `activity().results`.
                    _.each(inBoundLocations, function (locationData) {
                        var loc = ko.observable(new Location(locationData));
                        loc().marker = mapVm.addMarker(locationData);
                        activity().results.push(loc);
                    });

                    activity().visible(true);
                    vm.activities.push(activity);

                } else {
                    alert('Sorry, there are no locations for that activity in the current map bounds.');
                }

            } else {
                alert('Sorry, there was a problem retrieving results for the following reason: ' + status);
            }
        }

        function suppressOutOfBoundsLocations(locations) {
            var locLat, locLng;
            var inBoundLocations = [];
            _.each(locations, function (location) {
                locLat = location.geometry.location.lat();
                locLng = location.geometry.location.lng();

                // Store each `location` only if it is contained within the map boundaries at current zoom level.
                if (mapBounds.R.R < locLat && locLat < mapBounds.R.j &&
                    mapBounds.j.R > locLng && locLng > mapBounds.j.j) {

                    inBoundLocations.push(location);
                }
            });

            return inBoundLocations;
        }
    };


    /**
     *  Locations filter function
     */
    vm.filterQuery.subscribe(function filterResults() {

        // If there is no filter input, set the `applyFilter` state to false & display all of the markers again.
        if (vm.filterQuery().trim() === '') {

            vm.applyFilter(false);

            mapVm.showAllMarkers(vm.activities);

        } else {
            vm.applyFilter(true);

            // We use `activityVis` to track whether or not to hide the `#activity-location-group` div. The element
            // should be hidden if all of the member locations are filtered-out by the query.
            var activityVis;

            _.each(vm.activities(), function (activity) {

                // Hide location the list items and map markers for filtered-out locations.
                _.each(activity().results(), function (location) {

                    if( !(location().contains(vm.filterQuery())) ) {
                        location().visible(false);
                        mapVm.hideMarker(location);

                        activityVis = false;
                    } else {

                        // Re-display previously hidden markers (when `backspace` is pressed, for instance).
                        location().visible(true);
                        mapVm.showMarker(location);
                    }
                });

                // Check if any activity locations have become visible again, and if so set `activityVis` to true.
                _.some(activity().results(), function (location) {
                    if (location().visible()) {
                        activityVis = true;
                    }
                });

                activity().visible(activityVis);
            });
        }
    });

    // Hack to prevent page reload on the filter form submission.
    vm.preventDefault = function () {
        // (do nothing.)
    };


    /**
     *  Selected location functions
     */

    vm.selectLocation = function (location) {

        // Un-select all locations so that only one location appears selected at a time.
        vm.clearCurrentSelections();

        // The `selected()` observable property is used to control the css `background-color` of the location element.
        location.selected(true);

        mapVm.showInfoWindow(location, location.marker);
        mapVm.bounceAnimate(location.marker);
    };

    vm.clearCurrentSelections = function () {
        _.each(vm.activities(), function (activity) {
            _.each(activity().results(), function (location) {
                location().selected(false);
            });
        });
    };

    vm.getReferenceToActivitiesObject = function (activities) {
        vm.activities = activities;
    };
};
