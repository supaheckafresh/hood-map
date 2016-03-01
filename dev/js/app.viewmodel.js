
(function () {

    'use strict';


    var AppViewModel = function () {
        var vm = this;

        vm.MapViewModel = new MapViewModel();
        vm.LocationsViewModel = new LocationsViewModel(vm.MapViewModel);
        vm.ActivitiesViewModel = new ActivitiesViewModel(vm.MapViewModel, vm.LocationsViewModel);

    };

    var app = new AppViewModel();

    function displayComponents(components) {

        var $component, templateUrl, id, html;
        _.each(components, function (component) {

            var container = '#overlay-' + component;
            $component = $('<div>');
            templateUrl = './build/components/' + component + '/' + component + '.html';
            id = '#' + component;

            $component.load(templateUrl, id, function () {
                html = $(this).prop('outerHTML');
                $(container).append(html);

                ko.applyBindings(app, document.getElementById(component));
            });
        });
    }

    displayComponents(['searchbar', 'sidebar']);


    // Use jQuery-UI to make the search and sidebar UIs draggable.
    $(document).ready(
        function() {

            $('#overlay-searchbar').draggable();
            $('#overlay-sidebar').draggable();
        });

}());


