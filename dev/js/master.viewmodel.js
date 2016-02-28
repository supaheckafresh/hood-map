
(function () {

    'use strict';

    var MasterViewModel = function () {
        var vm = this;

        vm.MapViewModel = new MapViewModel();
        vm.LocationsViewModel = new LocationsViewModel(vm.MapViewModel);
        vm.ActivitiesViewModel = new ActivitiesViewModel(vm.MapViewModel, vm.LocationsViewModel);
    };

    ko.applyBindings(new MasterViewModel());

    $(document).ready(
        function() {
            $('#overlay-search').draggable();
            $('#overlay-sidebar').draggable();
        });

}());


