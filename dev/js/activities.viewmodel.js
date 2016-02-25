
var ActivitiesViewModel = function (mapVm, locationsVm) {
    'use strict';

    var vm = this;

    vm.defaultActivities = [
        'Portfolio Coffee House',
        'The Long Beach Museum of Art',
        'Aquarium of the Pacific',
        'The Pike',
        'lola\'s Mexican Cuisine'];

    vm.activities = ko.observableArray(vm.defaultActivities);
    vm.newActivity = ko.observable();

    // Search for (and display) locations for the default activities once the map has fully loaded and
    // Google Places Service is ready to receive queries.
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


    vm.addActivity = function () {

        // TODO: Validate input and handle duplicates (also what do do after map is resized).
        // TODO: Decide whether to display the desired activity in the UI even if there are no location results
        // (todo cont...) in the current map.

        vm.activities.push(vm.newActivity());

        vm.displayActivityLocations();
    };

    vm.displayActivityLocations = function () {
        locationsVm.searchActivityLocations(vm.newActivity());

        vm.newActivity('');
    };

};
