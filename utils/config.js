require('dotenv').config()
const convict = require('convict')

const config = convict({
  port: {
    doc: 'Port that Express listens on',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  database: {
    doc: 'MongoDB URI for database connection',
    format: String,
    default: '',
    env: 'MONGODB_URI'
  },
  frontendUrl: {
    doc: 'URL for the frontend application',
    format: String,
    default: 'folder.me',
    env: 'FRONTEND_URL'
  },
  authentication: {
    google: {
      clientId: {
        doc: 'Google Auth Client ID',
        default: '',
        env: 'GOOGLE_CLIENTID'
      },
      clientSecret: {
        doc: 'Google Auth Client Secret',
        default: '',
        env: 'GOOGLE_CLIENTSECRET'
      },
      callbackURL: {
        doc: 'Google Auth Callback UURL',
        default: '',
        env: 'GOOGLE_CALLBACK_URL'
      }
    },
    facebook: {
      clientId: {
        doc: 'Facebook Auth Client ID',
        default: '',
        env: 'FACEBOOK_CLIENTID'
      },
      clientSecret: {
        doc: 'Facebook Auth Client Secret',
        default: '',
        env: 'FACEBOOK_CLIENTSECRET'
      },
      callbackURL: {
        doc: 'Facebook Auth Callback URL',
        default: '',
        env: 'FACEBOOK_CALLBACK_URL'
      }
    },
    token: {
      secret: {
        doc: 'Secret key for JWT (signer)',
        default: 'jDGWbgiUDHGIWOGE&G8DUGVHUI',
        env: 'SECRET'
      },
      issuer: {
        doc: 'JWT Issuer',
        default: 'Test App',
        env: 'JWT_SIGNING_NAME'
      },
      audience: {
        doc: 'JWT Audience',
        default: 'Test App',
        env: 'JWT_SIGNING_NAME'
      }
    }
  }
})

// Perform validation
config.validate({
  allowed: 'strict'
})

module.exports = config.getProperties()