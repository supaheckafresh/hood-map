(function () {

    'use strict';

    /**
     *  Initialize the master ViewModel
     */
    var app = new AppViewModel();


    /**
     *  Render the UI components, and apply knockout data bindings
     */
    displayComponents(['searchbar', 'sidebar']);

    // For this project, I decided to make this component loader in lieu of using something like requirejs. I did
    // attempt to implement requirejs, but the console errors didn't provide me with specific enough information to
    // sort out what was wrong with my code. In any case, for the scope of this single-page-app, my solution seems to
    // work fine.
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


    /**
     *  Make the UI components draggable
     */
    $(document).ready(
        function() {

            $('#overlay-searchbar').draggable();
            $('#overlay-sidebar').draggable();
        });

}());