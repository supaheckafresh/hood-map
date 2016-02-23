
var ActivitiesViewModel = function () {
    'use strict';

    var vm = this;

    vm.defaultActivities = ['restaurants', 'museums', 'aquariums', 'parks', 'libraries'];

    this.activities = ko.observableArray(vm.defaultActivities);
    this.newActivity = ko.observable();

    this.addActivity = function () {

        // TODO: validate input

        vm.activities.push(vm.newActivity());
        console.log(vm.activities());

        vm.newActivity('');
    };

};
