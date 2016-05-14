// Copyright 2016 Alisha Adam <aadam@stanford.edu>

const Tp = require('thingpedia');
const Q = require('q');

module.exports = new Tp.ChannelClass({
    Name: "GoogleCalendarChannel",

    // constructor
    _init: function(engine, device) {
        this.parent();
        this.device = device;
        this.timeout = null;
    }

    get auth() {
        return 'Bearer ' + this.device.accessToken;
    },

    _doOpen: function() {        
        this.timeout = setTimeout(function() { this.emitEvent(['hello']); }.bind(this), 5000);
    },

    _doClose: function() {
         clearTimeout(this.timeout);
         this.timeout = 1000;
    }
});