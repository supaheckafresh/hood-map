(function () {

    'use strict';

    var GeolocationsViewModel = function () {
        var vm = this;

        // Initialize an empty object to store multiple `Geolocations`.
        vm.geolocations = ko.observableArray();

    };

    window.GeolocationsViewModel = GeolocationsViewModel;

}());