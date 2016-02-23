(function () {

    'use strict';

    var MasterViewModel = function () {


        this.MapViewModel = new MapViewModel();
        this.ActivitiesViewModel = new ActivitiesViewModel();
    };

    ko.applyBindings(new MasterViewModel());

}());

