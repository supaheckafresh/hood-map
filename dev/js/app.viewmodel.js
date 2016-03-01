
(function () {

    'use strict';


    var AppViewModel = function () {
        var vm = this;

        vm.MapViewModel = new MapViewModel();
        vm.LocationsViewModel = new LocationsViewModel(vm.MapViewModel);
        vm.ActivitiesViewModel = new ActivitiesViewModel(vm.MapViewModel, vm.LocationsViewModel);


        //ko.components.register('searchbar', {
        //    template: vm.searchUI().prop('outerHTML')
        //});
    };

    var app = new AppViewModel();

    var $searchbar = $('<div>');
    $searchbar.load('./build/components/searchbar/searchbar.html #search-view', function(){
        var searchbar = $(this).prop('outerHTML');

        $('#overlay-search').append(searchbar);

        ko.applyBindings(app, document.getElementById('search-view'));
    });

    //var $sidebar = $('<div>');
    //$sidebar.load('./build/components/sidebar/sidebar.html')


    // Use jQuery-UI to make the search and sidebar UIs draggable.
    $(document).ready(
        function() {

            $('#overlay-search').draggable();
            $('#overlay-sidebar').draggable();
        });

}());


