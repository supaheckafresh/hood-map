(function () {

    'use strict';

    var MasterViewModel = function () {

        this.MapViewModel = new MapViewModel();
        this.LocationsViewModel = new LocationsViewModel(this.MapViewModel);
        this.ActivitiesViewModel = new ActivitiesViewModel(this.MapViewModel, this.LocationsViewModel);
    };

    ko.applyBindings(new MasterViewModel());

}());

