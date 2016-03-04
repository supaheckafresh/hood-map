(function () {

    'use strict';

    //%20


    // per API docs, '/search' is probably better for finding specific location, whereas '/explore' might be used to
    // find most popular locations of a category in a given area.
    var baseUrl = 'https://api.foursquare.com/v2/venues/search',

    // TODO: remove clientId.
        clientId = '?client_id=PUXBJCP4B4HB2KIDIGQPHXEBAKWZPZO4HOWJZAJT45MOYWDO',

    // TODO: remove clientSecret.
        clientSecret = '&client_secret=D3NFA3PT5NC5440E5SJEOBJYYDN1BY20AASGXGF012F5Y1ND',
        version = '&v=20130815',
        latLng = '&ll=40.7,-74',
        query = '&query=sushi';

    var queryUrl = baseUrl + clientId + clientSecret + version + latLng + query;


}());