/* Copyright (c) 2013 Paul Negrutiu, MIT License */

var passport_google_oauth = require('passport-google-oauth')
var _ = require('lodash')
var GoogleStrategy = passport_google_oauth.OAuth2Strategy


module.exports = function (options) {

  var seneca = this
  var service = 'google'

  var params = {
    clientID:       options.clientID,
    clientSecret:   options.clientSecret,
    callbackURL:    options.urlhost + (options.callbackUrl || '/auth/google/callback'),
    scope:          ['https://www.googleapis.com/auth/userinfo.profile', ' https://www.googleapis.com/auth/userinfo.email']
  }
  params = _.extend(params, options.serviceParams || {})
  var authPlugin = new GoogleStrategy(params, function (accessToken, refreshToken, params, profile, done) {
    seneca.act(
      {
        role: 'auth',
        prepare: 'google_login_data',
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile: profile,
        params: params
      }, done)
  })

  return {
    name: 'express-google-auth'
  }
}
