
var ActivitiesViewModel = function () {
    'use strict';

    var vm = this;
    this.activities = ko.observableArray();
    this.newActivity = ko.observable();

    this.addActivity = function () {

        // TODO: validate input

        vm.activities.push(vm.newActivity());
        console.log(vm.activities());

        vm.newActivity('');
    };

};
