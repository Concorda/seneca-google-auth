var _ = require('lodash')

module.exports = function (opts) {
  var seneca = this
  var options = opts

  seneca.add('role: auth, cmd: loginGoogle', function (args, done) {
    var msg = _.extend({}, args, {role: 'auth', trigger: 'service-login-google', service: 'google'})
    delete msg.cmd
    seneca.act(msg, function (err, data) {
      done(err, data)
    })
  })

  function init_strategy (strategy) {
    seneca.act('role: web, get: server', function (err, data) {
      if (err) {
        throw new error('Cannot retrieve server: ' + err)
      }

      if (!data) {
        throw new error('Cannot retrieve server')
      }

      var server = data.server
      server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: options.password,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
        isSecure: _.has(options, 'isSecure') ? options.isSecure : true
      })

      seneca.act(
        'role: web',
        {
          plugin: 'auth',
          config: strategy,
          use: {
            prefix: '/auth/',
            pin: {role: 'auth', cmd: '*'},
            auth: 'google',
            map: {
              loginGoogle: {GET: true, POST: true, auth: 'google', alias: 'login_google'}
            }
          }
        }, function (err, result) {
          console.log('Register', err, result)
        })
    })
  }

  function init (args, done) {
    init_strategy(options)
    done()
  }

  seneca.add('init: hapi-google-auth', init)

  return {
    name: 'hapi-google-auth'
  }
}
