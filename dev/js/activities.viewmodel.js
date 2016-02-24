
var ActivitiesViewModel = function (mapVm, locationsVm) {
    'use strict';

    var vm = this;

    vm.defaultActivities = ['portfolio', 'art museum', 'aquarium', 'queen mary', 'lola\'s'];

    vm.activities = ko.observableArray(vm.defaultActivities);
    vm.newActivity = ko.observable();

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
    }

};
