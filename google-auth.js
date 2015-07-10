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
        role: 'google',
        cmd: 'prepareLoginData',
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile: profile,
        params: params
      }, done)
  })

  var prepareLoginData = function(args, cb){
    var accessToken = args.accessToken
    var refreshToken = args.refreshToken
    var profile = args.profile
    var params = args.params

    var data = {
      identifier: '' + profile.id,
      nick: profile.displayName,
      username: profile.username,
      credentials: {
        access: accessToken,
        refresh: refreshToken,
        expiresIn: params.expires_in
      },
      userdata: profile,
      when: new Date().toISOString()
    };

    data = _.extend({}, data, profile)
    if (data.emails && data.emails.length > 0){
      data.email = data.emails[0].value
    }
    if (data.name && _.isObject(data.name)){
      data.firstName = data.name.givenName
      data.lastName = data.name.familyName
      delete data.name
    }
    data.name = data.firstName + ' ' + data.lastName

    data[ service + '_id' ] = data.identifier

    data.service = data.service || {}
    data.service[ service ] = {
      credentials: data.credentials,
      userdata: data.userdata,
      when: data.when
    }
    cb(null, data)
  }

  seneca.add({role: 'google', cmd: 'prepareLoginData'}, prepareLoginData)

  seneca.act({role: 'auth', cmd: 'register_service', service: 'google', plugin: authPlugin, conf: options})

  return {
    name: 'google-auth'
  }
}
