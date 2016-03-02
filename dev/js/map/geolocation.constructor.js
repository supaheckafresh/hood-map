(function () {

    'use strict';

    var Geolocation = function Geolocation(data) {
        
        this.locationName = ko.observable(data.locationName);
        this.center = ko.observable(data.center);
        this.createdTime = ko.observable(_.now());
        this.activities = ko.observableArray(data.activities || []);
        this.active = ko.observable( data.active || false );
        this.zoom = ko.observable(data.zoom);
    };

    window.Geolocation = Geolocation;

}());