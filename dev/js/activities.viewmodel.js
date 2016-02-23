(function () {

    'use strict';

    var activitiesView = document.getElementById('activities-view');

    var ActivitiesViewModel = function () {
        var vm = this;
        this.activities = ko.observableArray();
        this.newActivity = ko.observable();

        this.addActivity = function () {
            vm.activities.push(vm.newActivity());
            console.log(vm.activities());

            vm.newActivity('');
        };

    };

    ko.applyBindings(new ActivitiesViewModel(), activitiesView);

}());