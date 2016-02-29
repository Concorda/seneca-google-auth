var _ = require('lodash')

module.exports = function (options) {
  var seneca = this
  var service = 'google'

  var prepareLoginData = function (args, cb) {
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
    }

    data = _.extend({}, data, profile)
    if (data.emails && data.emails.length > 0) {
      data.email = data.emails[0].value
      data.nick = data.email
    }
    if (data.name && _.isObject(data.name)) {
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

  seneca.add({role: 'auth', prepare: 'google_login_data'}, prepareLoginData)

  function init (args, done) {
    done()
  }

  seneca.add('init: common-google-auth', init)

  return {
    name: 'common-google-auth'
  }
}
