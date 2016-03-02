
(function () {

    'use strict';

    var ActivitiesViewModel = function (mapVm, locationsVm, geolocationsVm) {

        /**
         *  Top-level variables and properties for `ActivitiesViewModel()`
         */
        var vm = this;

        vm.defaultActivities = [
            'Coffee',
            'Vegetarian',
            'Park',
            'Mexican',
            'Art Gallery'];

        vm.activities = ko.observableArray();
        vm.activityQuery = ko.observable();


        /**
         *  Display locations for default activities
         */

            // Search for (and display) locations for the default activities once the map has fully loaded and Google Places
            // Service is ready to receive queries.
        mapVm.readyState.subscribe(function () {
            if (mapVm.readyState() === true) {
                vm.displayDefaultActivities();
                console.log(ko.toJSON(geolocationsVm.currentGeolocation().activities()));
            }
        });

        vm.displayDefaultActivities = function () {

            vm.passReferenceToLocationsVm();

            _.each(vm.defaultActivities, function (activityName) {
                var activity = ko.observable(new Activity(activityName));
                geolocationsVm.currentGeolocation().activities.push(activityName);
                locationsVm.searchLocations(activity);
            });

        };


        /**
         *  New activity functions
         */

            // TODO: Validate input and handle duplicates (also what do do after map is resized).
            // TODO: Decide whether to display the desired activity in the UI even if there are no location results
            // (todo cont...) at the current map zoom.
        vm.addActivity = function () {
            var activity = ko.observable(new Activity(vm.activityQuery()));
            locationsVm.searchLocations(activity);
            vm.activityQuery('');
        };

        vm.passReferenceToLocationsVm = function () {
            locationsVm.getReferenceToActivitiesObject(vm.activities);
        };

        vm.activities.subscribe(function () {
            vm.passReferenceToLocationsVm();
        });

    };

    window.ActivitiesViewModel = ActivitiesViewModel;

}());
