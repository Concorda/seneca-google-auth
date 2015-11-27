var error = require('eraro')({
  package: 'google-auth'
})

var CommonAuth = require('./lib/common-google-auth')
var ExpressAuth = require('./lib/express-google-auth')
var HapiAuth = require('./lib/hapi-google-auth')

/**
 *
 * Google Authentification Seneca Plugin
 *
 * @param {Object} options - Plugin options
 *
 * @param {string} options.clientID - google Auth Client Id
 * @param {string} options.clientSecret - google Auth Client Id
 * @param {string} options.urlhost - url of the client
 *
 * @returns {{name: string}} the plugin name, google-auth
 */
module.exports = function (options) {
  var seneca = this
  var internals = {}
  internals.accepted_framworks = [
    'express',
    'hapi'
  ]
  internals.options = options

  if (!options.framework) {
    options.framework = 'express'
  }

  internals.choose_framework = function () {
    if (internals.options.framework === 'express') {
      internals.load_express_implementation()
    }
    else {
      internals.load_hapi_implementation()
    }
  }

  internals.check_options = function () {
    if (seneca.options().plugin.web && seneca.options().plugin.web.framework) {
      internals.options.framework = seneca.options().plugin.web.framework
    }

    if (internals.accepted_framworks.indexOf(internals.options.framework) === -1) {
      throw error('Framework type <' + internals.options.framework + '> not supported.')
    }
  }

  internals.load_express_implementation = function () {
    seneca.use(ExpressAuth, internals.options)
    seneca.use(CommonAuth, internals.options)
  }

  internals.load_hapi_implementation = function () {
    seneca.use(HapiAuth, internals.options)
    seneca.use(CommonAuth, internals.options)
  }

  function init (args, done) {
    internals.check_options()
    internals.choose_framework()
    done()
  }

  seneca.add('init: google-auth', init)

  return {
    name: 'google-auth'
  }
}
