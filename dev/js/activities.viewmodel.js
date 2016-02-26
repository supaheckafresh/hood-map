
var ActivitiesViewModel = function (mapVm, locationsVm) {
    'use strict';

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

    vm.activities = ko.observableArray(vm.defaultActivities);
    vm.newActivity = ko.observable();


    /**
     *  Display locations for default activities
     */

    // Search for (and display) locations for the default activities once the map has fully loaded and Google Places
    // Service is ready to receive queries.
    mapVm.readyState.subscribe(function () {
        if (mapVm.readyState() === true) {
            vm.displayDefaultActivities();
        }
    });

    vm.displayDefaultActivities = function () {
        _.each(vm.activities(), function (activity) {
            locationsVm.searchActivityLocations(activity);
        });
    };


    /**
     *  New activity functions
     */

    // TODO: Validate input and handle duplicates (also what do do after map is resized).
    // TODO: Decide whether to display the desired activity in the UI even if there are no location results
    // (todo cont...) at the current map zoom.
    vm.addActivity = function () {
        vm.activities.push(vm.newActivity());

        vm.displayActivityLocations();
    };

    vm.displayActivityLocations = function () {
        locationsVm.searchActivityLocations(vm.newActivity());
        vm.newActivity('');
    };

};
