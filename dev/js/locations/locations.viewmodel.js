
(function () {

    'use strict';

    // A `Location` represents any place result of an activity query; not to be confused with a geolocation which
    // represents a city or geographic region presented on the map.
    var LocationsViewModel = function (mapVm, foursquareService) {


        /**
         *  Top-level variables and properties for `LocationsViewModel()`
         */
        var vm = this;

        // Initialize `filterQuery` observable to bind to user input in the locations filter form.
        vm.filterQuery = ko.observable('');

        vm.selectedLocation = ko.observable('');


        /**
         *  Activity locations search function
         */
        vm.searchLocations = function (activity) {

            var mapBounds = mapVm.mapCopy.getBounds();
            console.log(mapBounds);

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

                            // Request foursquare data for each location & save the results as a location property.
                            vm.requestFoursquareData(loc);

                            loc().marker = mapVm.addMarker(loc, activity);
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
                console.log(locations);
                var locLat, locLng;
                var inBoundLocations = [];
                _.each(locations, function (location) {
                    locLat = location.geometry.location.lat();
                    locLng = location.geometry.location.lng();

                    // Store each `location` only if it is contained within the map boundaries at current zoom level.
                    if (mapBounds.H.H < locLat && locLat < mapBounds.H.j &&
                        mapBounds.j.H > locLng && locLng > mapBounds.j.j) {

                        inBoundLocations.push(location);
                    }
                });

                return inBoundLocations;
            }
        };


        /**
         *  Retrieve foursquare data
         */
        vm.requestFoursquareData = function (location) {
            foursquareService.makeQueryUrl(location);
            foursquareService.getResults(location);
        };


        /**
         *  Locations filter function
         */
        vm.filterQuery.subscribe(function filterAlgorithm() {

            if (filterInputIsEmpty()) {
                unfilterResults();
                mapVm.showMarkersForVisibleActivities(vm.activities);

            } else {
                filterResults();
            }

            // TODO: redisplay selected location info window after filter.
            function filterResults() {
                
                var activityVisibilityDuringFilter;

                _.each(vm.activities(), function (activity) {

                    if (activity().results().length > 0) {

                        _.each(activity().results(), function (location) {

                            // Hide the location list items and map markers for filtered-out locations.
                            if( !(location().contains(vm.filterQuery())) ) {

                                location().visible(false);
                                mapVm.hideMarker(location);

                                if (location().selected() === true) {
                                    mapVm.resetInfoWindow();
                                }

                                // The `activityVisibilityDuringFilter` and `hasFilterResults` states will only remain
                                // false if there are zero location results within an activity containing the filter
                                // query string.
                                activityVisibilityDuringFilter = false;
                                activity().hasFilterResults(false);

                            } else {

                                // Re-display previously hidden locations and markers (when `backspace` is pressed,
                                // for instance).
                                location().visible(true);
                                activity().hasFilterResults(true);

                                if (activity().checked() === true) {
                                    mapVm.showMarker(location);

                                    // Reopen info window for selected location.
                                    if (location().selected() === true) {
                                        mapVm.infoWindow().open(mapVm.mapCopy, location().marker);
                                    }
                                }
                            }
                        });

                        // Check if any activity locations have are visible again, and if so set
                        // `activityVisibilityDuringFilter` to true (so long as the activity was `checked` prior to
                        // starting the filter query).
                        _.some(activity().results(), function (location) {
                            if (location().visible() && activity().checked() === true) {
                                activityVisibilityDuringFilter = true;
                                activity().hasFilterResults(true);
                            }
                        });

                        // Update the UI after every keystroke.
                        activity().visible(activityVisibilityDuringFilter);
                    }
                });
            }

            function filterInputIsEmpty() {
                return vm.filterQuery().trim() === '';
            }

            function unfilterResults() {
                _.each(vm.activities(), function (activity) {

                    _.each(activity().results(), function (location) {
                        location().visible(true);
                    });

                    resetInitialVisibility(activity);
                });

                function resetInitialVisibility(activity) {
                    if (activity().results().length === 0) {
                        activity().visible(false);
                    }

                    if (activity().checked() === true) {
                        if (activity().results().length > 0) {
                            activity().visible(true);
                            activity().hasFilterResults(true);
                        }
                    } else {
                        if (activity().results().length > 0) {
                            activity().hasFilterResults(true);
                        }
                    }
                }
            }

        });

        // Hack to prevent page reload on the filter form submission.
        vm.preventDefault = function () {
            // (do nothing.)
        };


        /**
         *  Update locations when the geolocation changes
         */
        mapVm.currentGeolocation.subscribe(function updateLocations() {

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
            vm.selectedLocation(location);

            mapVm.showInfoWindow(location);
            mapVm.centerMapAt(location);
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

        vm.passSelfToMapVm = function () {
            mapVm.locationsVm = vm;
        };
        vm.passSelfToMapVm();

        vm.passSelectedLocationToMapVm = function () {
            mapVm.selectedLocation(vm.selectedLocation);
        };

        vm.selectedLocation.subscribe(function () {
           vm.passSelectedLocationToMapVm();
        });
    };

    window.LocationsViewModel = LocationsViewModel;

})();

