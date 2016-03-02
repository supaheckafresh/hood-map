(function () {

    'use strict';

    var Geolocation = function Geolocation(data) {
        this.locationName = ko.observable(data.locationName());
        this.center = ko.observable(data.center);
        this.queryTime = ko.observable(_.now());
        this.activities = ko.observable(data.activities());
        this.active = ko.observable(false);
        this.zoom = ko.observable(data.zoom);
    }

}());