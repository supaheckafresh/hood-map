
var Location = function Location(data) {

    this.name = ko.observable(data.name);
    this.visible = ko.observable(true);
    this.selected = ko.observable(false);
    this.place_id = ko.observable(data.place_id);
    this.formatted_address = ko.observable(data.formatted_address);
    this.geometry = ko.observable(data.geometry);

    // TODO: filter types
    this.types = ko.observableArray(data.types);
    this.marker = null;
};

// TODO: Also search for `str` within `Location.types`.
Location.prototype.contains = function (str, caseSensitive) {
    if (caseSensitive === true) {
        return this.name().includes(str);
    } else {
        return this.name().toLowerCase().indexOf(str.toLowerCase()) > -1;
    }
};