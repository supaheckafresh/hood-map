(function () {

    'use strict';

    var map;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 4
        });
    }

    // make initMap() available in global scope
    window.initMap = initMap;

}());