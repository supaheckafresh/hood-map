
(function () {
    'use strict';

    var Activity = function Activity(activityQuery) {

        this.title = activityQuery;
        this.results = ko.observableArray();
        this.visible = ko.observable(false);
    };

    window.Activity = Activity;

})();

