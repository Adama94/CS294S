// Copyright 2016 Alisha Adam <aadam@stanford.edu>

const Tp = require('thingpedia');

module.exports = new Tp.DeviceClass({
    Name: 'GoogleCalendarDevice',
    UseOAuth2: Tp.Helpers.OAuth2({
		kind: 'com.google.calendar',
		client_id: '281514559346-0348d4rmgrdk00650mlo2uba2plhgsv8.apps.googleusercontent.com',
		client_secret: 'SqOpyvbln3TI1wA-QEc_QJv-',
		scope: ['openid','profile','email',
				'https://www.googleapis.com/auth/plus.me',
				'https://www.googleapis.com/auth/calendar.readonly'],
		authorize: 'https://accounts.google.com/o/oauth2/auth',
		get_access_token: 'https://accounts.google.com/o/oauth2/token',
		callback: function(engine, accessToken, refreshToken) {
			var auth = 'Bearer ' + accessToken;
			return Tp.Helpers.Http.get('https://www.googleapis.com/oauth2/v2/userinfo', { auth: auth, accept: 'application/json' })
			.then(function(response) {
				var parsed = JSON.parse(response);
				return engine.devices.loadOneDevice({ kind: 'com.google.calendar',
													  accessToken: accessToken,
													  refreshToken: refreshToken,
													  profileId: parsed.id }, true);
			});
		}
	}),

	_init: function(engine, state) {
        this.parent(engine, state);

        this.uniqueId = 'com.google.calendar-' + this.profileId;
        this.name = "Google Calendar %s".format(this.profileId);
        this.description = "This is your Google Calendar.";
    },

    get profileId() {
        return this.state.profileId;
    },

    get accessToken() {
        return this.state.accessToken;
    },
});