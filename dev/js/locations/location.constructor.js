
var Location = function (data) {
    var self = this;
    self.name = ko.observable(data.name);
    self.visible = ko.observable(true);
    self.selected = ko.observable(false);
    self.place_id = ko.observable(data.place_id);
    self.formatted_address = ko.observable(data.formatted_address);
    self.geometry = ko.observable(data.geometry);
    // TODO: filter types
    self.types = ko.observableArray(data.types);
    self.marker = null;
};

// TODO: Also search for `str` within `Location.types`.
Location.prototype.contains = function (str, caseSensitive) {
    if (caseSensitive === true) {
        return this.name().includes(str);
    } else {
        return this.name().toLowerCase().indexOf(str.toLowerCase()) > -1;
    }
};