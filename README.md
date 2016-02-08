![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js](http://senecajs.org) Auth Plugin

# seneca-google-auth
[![npm version][npm-badge]][npm-url]
[![Dependency Status][david-badge]][david-url]
[![Gitter chat][gitter-badge]][gitter-url]



This plugin is used by [seneca-auth](https://www.npmjs.com/package/seneca-auth) for authenticating via google login.
It uses [PassportJS](http://passportjs.org). The [seneca-auth](https://www.npmjs.com/package/seneca-auth) is the
authentication plugin used by [Seneca](http://senecajs.org) toolkit.

For a gentle introduction to Seneca itself, see the [senecajs.org](http://senecajs.org) site.

If you're using this plugin module, feel to contact on twitter if you have any questions! :) [@rjrodger](http://twitter.com/rjrodger)

### Install

```sh
npm install seneca-google-auth
```

### Using Google Auth

When using `seneca-auth` the google auth must be initialized using:

```
..........
    service: {
      "local": {},
      "google" : {
        "clientID" : "your client id",
        "clientSecret" : "app secret",
        "urlhost" : "server host",
        "serviceParams": {
          "scope" : [
            .....
          ]
        }
      }
    }
..........

```

Note: `serviceParams` can be used to pass any other parameter to the passport google strategy.
More information can be found in the Google documentation.

## Other information

There is provided a default seneca action that will prepare user data to a more convenient structure.
If this data structure is not matching the expected user data structure used by your application, you can overwrite the
seneca action and implement your own google-login-data action.

    {role: 'auth', prepare: 'google_login_data'}

The JSON object provided for this actions contains following data from Google login:
 - `accessToken`
 - `refreshToken`
 - `profile`


 Note: You can provide also the `callbackUrl` as part of the options. If not provided then a default value is used.

 Default value for `callbackUrl`: `/auth/google/callback`

[npm-badge]: https://img.shields.io/npm/v/seneca-google-auth.svg
[npm-url]: https://npmjs.com/package/seneca-google-auth
[david-badge]: https://david-dm.org/senecajs/seneca-google-auth.svg
[david-url]: https://david-dm.org/senecajs/seneca-google-auth
[gitter-badge]: https://badges.gitter.im/senecajs/seneca.png
[gitter-url]: https://gitter.im/senecajs/seneca


