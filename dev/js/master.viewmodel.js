(function () {

    'use strict';

    var MasterViewModel = function () {

        this.MapViewModel = new MapViewModel();
        this.ActivitiesViewModel = new ActivitiesViewModel(this.MapViewModel);

    };

    ko.applyBindings(new MasterViewModel());

}());

