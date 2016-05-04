(function () {

    'use strict';

    var foursquareService = function () {

        var foursquare = this;

        foursquare.makeQueryUrl = function (location) {

            // per API docs, '/search' is probably better for finding specific location, whereas '/explore' might be used to
            // find most popular locations of a category in a given area.
            var baseUrl = 'https://api.foursquare.com/v2/venues/search',

            // TODO: remove clientId.
                clientId = '?client_id=PUXBJCP4B4HB2KIDIGQPHXEBAKWZPZO4HOWJZAJT45MOYWDO',

            // TODO: remove clientSecret.
                clientSecret = '&client_secret=D3NFA3PT5NC5440E5SJEOBJYYDN1BY20AASGXGF012F5Y1ND',
                version = '&v=20130815',
                latLng = '&ll=' + location().shortLatLng(),
                query = '&query=' + location().name().split(' ').join('%20'),
                limit = '&limit=1';


            location().foursquareQueryUrl(  baseUrl +
                                            clientId +
                                            clientSecret +
                                            version +
                                            latLng +
                                            query +
                                            limit);

        };


        foursquare.getCheckinsCountFor = function (location, activity, callback) {

            ko.computed(function () {

                $.getJSON(location().foursquareQueryUrl())
                    .then(function (res) {

                        if (res.response.venues.length > 0) {

                            var locationCheckins = res.response.venues[0].stats.checkinsCount;

                            locationCheckins ? location().checkins(locationCheckins) : location().checkins(0);
                        } else {
                            location().checkins(0);
                        }

                        var color = location().getColor();

                        location().marker = callback(location, activity, color);
                    })
                    .fail(function () {
                        console.log('*****There was an error retrieving foursquare info for ' +
                                        location().name() + '*****');
                    });

            }, this);
        };
    };

    window.foursquareService = foursquareService;

}());