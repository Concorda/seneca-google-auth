/* Copyright (c) 2013 Paul Negrutiu, MIT License */

var passport_google_oauth = require('passport-google-oauth')

var GoogleStrategy = passport_google_oauth.OAuth2Strategy


module.exports = function (options) {

  var seneca = this

  var authPlugin = new GoogleStrategy({
    clientID:       options.clientID,
    clientSecret:   options.clientSecret,
    callbackURL:    options.urlhost + '/auth/google/callback',
    scope:          ['https://www.googleapis.com/auth/userinfo.profile', ' https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/analytics.readonly']
  })

  var authCallback = function (accessToken, refreshToken, params, profile, done) {
    var data = {
      email: profile.emails.length > 0 ? profile.emails[0].value : null,
      nick: profile.displayName,
      name: profile.displayName,
      identifier: '' + profile.id,
      credentials: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: params.expires_in
      },
      userdata: profile,
      when: new Date().toISOString()
    };
    done(null, data);
  }

  seneca.act({role: 'auth', cmd: 'register_service', service: 'google', plugin: authPlugin, authCallback: authCallback})

  return {
    name: 'google-auth'
  }
}
