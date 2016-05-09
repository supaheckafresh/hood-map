
(function () {

    'use strict';

    var Location = function Location(data) {

        this.name = ko.observable(data.name);
        this.visible = ko.observable(true);
        this.selected = ko.observable(false);
        this.place_id = ko.observable(data.place_id);
        this.formatted_address = ko.observable(data.formatted_address);
        this.geometry = ko.observable(data.geometry);
        this.types = ko.observableArray(data.types);
        this.marker = null;
        this.foursquare_id = '';

        this.foursquareQueryUrl = ko.observable('');

        this.checkins = ko.observable();
    };

// TODO: Also search for `str` within `Location.types`.
    Location.prototype.contains = function (str, caseSensitive) {
        if (caseSensitive === true) {
            return this.name().includes(str);
        } else {
            return this.name().toLowerCase().indexOf(str.toLowerCase()) > -1;
        }
    };

    Location.prototype.shortLatLng = function () {
        return (Math.round(this.geometry().location.lat() * 1000) / 1000) + ',' +
                (Math.round(this.geometry().location.lng() * 1000) / 1000);
    };

    // I know this switch is terrible, but I used in place of a formula because I wanted to be able to easily tweak the
    // thresholds (these are arbitrary) where different marker colors are used.
    Location.prototype.getColor = function () {
        var checkins = this.checkins();
        switch (true) {
            case (checkins > 1000):
                return '1';
            case (checkins > 600):
                return '2';
            case (checkins > 350):
                return '3';
            case (checkins > 120):
                return '4';
            case (checkins > 60):
                return '5';
            case (checkins > 30):
                return '6';
            case (checkins > 16):
                return '7';
            default:
                return '7';
        }
    };

    Location.prototype.foursquareVenueUrl = function () {
        if (this.foursquare_id)
            return 'http://foursquare.com/v/' + this.foursquare_id;
    };

    window.Location = Location;

})();
