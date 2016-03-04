
(function () {

    'use strict';

    var Activity = function Activity(activityQuery) {

        this.title = activityQuery;
        this.results = ko.observableArray();
        this.visible = ko.observable(true);

        // We use `checked` to determine if an activity was initially visible when prior to applying the filter query.
        this.checked = ko.observable(true);

        // We use `hasFilterResults` to determine if the activity checkbox should be disabled.
        this.hasFilterResults = ko.observable();
    };

    Activity.prototype.toggleMarkersVisible = function () {

        var self = this;
        self.toggleChecked();

        if (self.results().length > 0) {

            var firstLocation = _.head(self.results());
            if ( firstLocation().marker.getMap() !== null) {
                self.mapReference = firstLocation().marker.getMap();
            }

            _.each(self.results(), function (location) {
                if (location().marker.getMap() === null) {
                    location().marker.setMap(self.mapReference);
                } else {
                    location().marker.setMap(null);
                }
            });
        }
        return true;
    };

    Activity.prototype.toggleChecked = function () {
        var self = this;
        self.checked( !(self.checked()));
        return true;
    };

    window.Activity = Activity;

})();


