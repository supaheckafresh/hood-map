
(function () {

    'use strict';

    /**
     * Master ViewModel constructor
     */
    var AppViewModel = function () {
        var vm = this;

        vm.MapViewModel = new MapViewModel();
        vm.LocationsViewModel = new LocationsViewModel(vm.MapViewModel);
        vm.ActivitiesViewModel = new ActivitiesViewModel(vm.MapViewModel, vm.LocationsViewModel);

    };

    window.AppViewModel = AppViewModel;

}());


