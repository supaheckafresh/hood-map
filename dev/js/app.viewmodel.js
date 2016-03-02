
(function () {

    'use strict';

    /**
     * Master ViewModel constructor
     */
    var AppViewModel = function () {
        var vm = this;

        vm.GeolocationsViewModel = new GeolocationsViewModel();
        vm.MapViewModel = new MapViewModel(vm.GeolocationsViewModel);
        vm.LocationsViewModel = new LocationsViewModel(vm.MapViewModel);
        vm.ActivitiesViewModel = new ActivitiesViewModel(vm.MapViewModel, vm.LocationsViewModel);

    };

    window.AppViewModel = AppViewModel;

}());


