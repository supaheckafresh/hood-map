(function () {

    'use strict';

    var GeolocationsViewModel = function () {
        var vm = this;

        // Initialize an empty object to store multiple `Geolocations`.
        vm.geolocations = ko.observableArray();

        vm.currentGeolocation = ko.observable({});

    };

    window.GeolocationsViewModel = GeolocationsViewModel;

}());