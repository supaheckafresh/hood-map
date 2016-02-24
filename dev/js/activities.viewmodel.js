
var ActivitiesViewModel = function (mapVm, locationsVm) {
    'use strict';

    var vm = this;

    vm.defaultActivities = ['restaurants', 'museums', 'aquariums', 'parks', 'libraries'];

    vm.activities = ko.observableArray(vm.defaultActivities);
    vm.newActivity = ko.observable();

    vm.addActivity = function () {

        // TODO: Validate input and handle duplicates (also what do do after map is resized).

        vm.activities.push(vm.newActivity());
        locationsVm.searchActivityLocations(vm.newActivity());

        vm.newActivity('');
    };

};
