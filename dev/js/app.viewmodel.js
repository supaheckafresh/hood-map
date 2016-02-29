
(function () {

    'use strict';

    var AppViewModel = function () {
        var vm = this;

        vm.MapViewModel = new MapViewModel();
        vm.LocationsViewModel = new LocationsViewModel(vm.MapViewModel);
        vm.ActivitiesViewModel = new ActivitiesViewModel(vm.MapViewModel, vm.LocationsViewModel);
    };

    ko.applyBindings(new AppViewModel());

    // Use jQuery-UI to make the search and sidebar UIs draggable.
    $(document).ready(
        function() {
            $('#overlay-search').draggable();
            $('#overlay-sidebar').draggable();
        });

}());


