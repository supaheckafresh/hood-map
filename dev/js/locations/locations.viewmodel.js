
(function () {

    'use strict';

    // A `Location` represents any place result of an activity query; not to be confused with a geolocation which
    // represents a city or geographic region presented on the map.
    var LocationsViewModel = function (mapVm) {

        /**
         *  Top-level variables and properties for `LocationsViewModel()`
         */
        var vm = this;

        // Initialize `filterQuery` observable to bind to user input in the locations filter form.
        vm.filterQuery = ko.observable('');


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
                            loc().marker = mapVm.addMarker(locationData, activity);
                            activity().results.push(loc);
                        });

                        // If the activity was previously made invisible due to there being no location results for a
                        // previous geolocation, set the visibility to true so that the results will be displayed.
                        if (activity().noResultsForLastGeolocation) {
                            activity().noResultsForLastGeolocation = false;
                            activity().visible(true);
                        }

                        vm.activities.push(activity);

                    } else {

                        activity().visible(false);
                        activity().noResultsForLastGeolocation = true;

                        // We still want to save the activity so that it can be queried again for new geolocations.
                        vm.activities.push(activity);

                        alert('Sorry, there are no locations for ' + activity().title + ' in the current map bounds.');
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

            if (vm.filterQuery().trim() === '') {

                vm.applyFilter(false);

                _.each(vm.activities(), function (activity) {

                    _.each(activity().results(), function (location) {
                        location().visible(true);
                    });

                    if (activity().results().length === 0) {
                        activity().visible(false);
                    }

                    if (activity().checked() == true) {
                        if (activity().results().length > 0) {
                            activity().visible(true);
                            activity().hasResults(true);
                        }
                    }
                });
                mapVm.showAllMarkers(vm.activities);

            } else {

                vm.applyFilter(true);

                // We use `activityVis` to track whether or not to hide the `#activity-location-group` div. The element
                // should be hidden if all of the member locations are filtered-out by the query.
                var activityVis;

                _.each(vm.activities(), function (activity) {

                    if (activity().results().length > 0) {

                        // Hide location the list items and map markers for filtered-out locations.
                        _.each(activity().results(), function (location) {

                            if( !(location().contains(vm.filterQuery())) ) {
                                location().visible(false);
                                mapVm.hideMarker(location);

                                activityVis = false;

                                activity().hasResults(false);
                            } else {

                                // Re-display previously hidden markers (when `backspace` is pressed, for instance).
                                location().visible(true);
                                mapVm.showMarker(location);

                                activity().hasResults(true);
                            }
                        });

                        // Check if any activity locations have become visible again, and if so set `activityVis` to true.
                        _.some(activity().results(), function (location) {
                            if (location().visible()  && activity().checked() === true) {
                                activityVis = true;

                                activity().hasResults(true);
                            }
                        });

                        activity().visible(activityVis);
                    }
                });
            }
        });

        // Hack to prevent page reload on the filter form submission.
        vm.preventDefault = function () {
            // (do nothing.)
        };


        /**
         *  Update locations when Geolocation changes
         */
        mapVm.currentLocation.subscribe(function updateLocations() {

            var copy = vm.activities();

            // Clear currently displayed map markers, and clear stored Location results. Only clearing the entire
            // `vm.activities()`, as below object does not update the UI in the way one would expect; without iterating
            // over the activity results, the location results for the previous geolocation continue to appear.
            _.each(vm.activities(), function (activity) {
                _.each(activity().results(), function (location){
                    location().marker.setMap(null);
                });
                activity().results([]);
            });

            vm.activities([]);

            // Update Location results for new Geolocation
            _.each(copy, function (activity) {
                vm.searchLocations(activity);
            });
        });


        /**
         *  Selected location functions
         */

        vm.selectLocation = function (location) {

            // Un-select all locations so that only one location appears selected at a time.
            vm.clearCurrentSelections();

            // The `selected()` observable property is used to control the css `background-color` of the location element.
            location.selected(true);

            mapVm.centerMapAt(location);
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

    window.LocationsViewModel = LocationsViewModel;

})();

