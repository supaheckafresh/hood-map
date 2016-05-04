
(function () {

    'use strict';

    /**
     * Master ViewModel constructor
     */
    var AppViewModel = function () {
        var vm = this;

        vm.foursquareService = new foursquareService();

        vm.MapViewModel = new MapViewModel(vm.foursquareService);
        vm.LocationsViewModel = new LocationsViewModel(vm.MapViewModel, vm.foursquareService);
        vm.ActivitiesViewModel = new ActivitiesViewModel(vm.MapViewModel, vm.LocationsViewModel);

    };

    window.AppViewModel = AppViewModel;

}());


