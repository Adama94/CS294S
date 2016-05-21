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
    },

    get auth() {
        return 'Bearer ' + this.device.accessToken;
    },

    _doOpen: function() {        
        // this.emitEvent([this.device.accessToken]);
        // var calendarId;
        var self = this;
        return Tp.Helpers.Http.get('https://www.googleapis.com/calendar/v3/users/me/calendarList/primary', {auth: auth, accept: 'application/json' })
            .then(function(response) {
                var parsedResponse = JSON.parse(response);
                self.emitEvent([parsedResponse.summary]);
                return parsedResponse.summary;
            });    

        // return Tp.Helpers.Http.get('GET https://www.googleapis.com/calendar/v3/users/me/calendarList', { auth: auth, accept: 'application/json' })
        //     .then(function(response) {
        //         var parsed = JSON.parse(response);
        //         calendarId = parsed.id;
                
        //         return Tp.Helpers.Http.get('GET https://www.googleapis.com/calendar/v3/users/me/calendarList/' + calendarId, {auth: auth, accept: 'application/json' })
        //             .then(function(response) {
        //                 var parsedResponse = JSON.parse(response);
        //                 return parsedResponse.summary;
        //             });                            
        //     });
    },

    _doClose: function() {
         clearTimeout(this.timeout);
         this.timeout = 1000;
    }
});