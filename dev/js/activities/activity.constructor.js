
(function () {
    'use strict';


    var Activity = function Activity(activityQuery) {

        this.title = activityQuery;
        this.results = ko.observableArray();
        this.visible = ko.observable(true);
    };


    Activity.prototype.toggleMarkersVisible = function () {

        var self = this;

        var firstLocation = _.head(this.results());
        if ( firstLocation().marker.getMap() !== null) {
            self.mapReference = firstLocation().marker.getMap();
        }

        _.each(this.results(), function (location) {
            if (location().marker.getMap() === null) {
                location().marker.setMap(self.mapReference);
            } else {
                location().marker.setMap(null);
            }
        });
        return true;
    };


    window.Activity = Activity;

})();


