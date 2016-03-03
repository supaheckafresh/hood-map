
(function () {
    'use strict';


    var Activity = function Activity(activityQuery) {

        this.title = activityQuery;
        this.results = ko.observableArray();
        this.visible = ko.observable(true);
        this.checked = ko.observable(true);
        this.hasResults = ko.observable();
    };


    Activity.prototype.toggleMarkersVisible = function () {

        var self = this;

        self.toggleChecked();

        if (this.results().length > 0) {

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
        }

        return true;
    };

    Activity.prototype.toggleChecked = function () {
        var self = this;
        self.checked( !(self.checked()));
        console.log(self.title + ' ' + self.checked())
        return true;
    };


    window.Activity = Activity;

})();


