var _ = require('lodash')

module.exports = function (opts) {
  var seneca = this
  var options = opts

  // try to match options with Express type in case we are receiving them like that
  options.provider = options.provider || 'google'
  options.password = options.password || 'secret'
  options.clientId = options.clientId || options.clientID

  function loginGoogle (args, done) {
    var msg = _.extend({}, args, {role: 'auth', trigger: 'service-login-google', service: 'google'})
    delete msg.cmd
    seneca.act(msg, function (err, data) {
      done(err, data)
    })
  }

  seneca.add('role: auth, cmd: loginGoogle', loginGoogle)
  seneca.add('role: auth, cmd: loginGoogleCb', loginGoogle)

  function init_strategy (strategy) {
    seneca.act('role: web, get: server', function (err, data) {
      if (err) {
        throw new Error('Cannot retrieve server: ' + err)
      }

      if (!data) {
        throw new Error('Cannot retrieve server')
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
              loginGoogle: {GET: true, POST: true, auth: 'google', alias: 'google'},
              loginGoogleCb: {GET: true, POST: true, auth: 'google', alias: 'google_callback'}
            }
          }
        }, function (err, result) {
          seneca.log.debug('Register', err, result)
        })
    })
  }

  function init (args, done) {
    init_strategy(options)

    seneca.act({role: 'auth', cmd: 'register_service', service: 'google', conf: options})
    done()
  }

  seneca.add('init: hapi-google-auth', init)

  return {
    name: 'hapi-google-auth'
  }
}
