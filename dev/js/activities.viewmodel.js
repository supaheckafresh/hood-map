(function () {

    'use strict';

    var activitiesView = document.getElementById('activitiesView');

    var ActivitiesViewModel = function () {
        var that = this;
        this.activities = ko.observableArray([]);
        this.newThing = ko.observable();

        this.newThing.subscribe(function (entry) {
            addActivity(entry);
        });

        function addActivity(activity) {
            that.activities.push(activity);
            console.log(that.activities());
        }

    };

    ko.applyBindings(new ActivitiesViewModel(), activitiesView);

}());