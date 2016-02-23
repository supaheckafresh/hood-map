
var ActivitiesViewModel = function (mapVm) {
    'use strict';

    var vm = this;

    vm.defaultActivities = ['restaurants', 'museums', 'aquariums', 'parks', 'libraries'];

    vm.activities = ko.observableArray(vm.defaultActivities);
    vm.newActivity = ko.observable();

    vm.addActivity = function () {

        // TODO: validate input

        vm.activities.push(vm.newActivity());
        mapVm.searchActivityLocations(vm.newActivity());
        mapVm.addMarker(vm.newActivity());

        vm.newActivity('');
    };

};
