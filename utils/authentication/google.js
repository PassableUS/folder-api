const passport = require('passport')
const passportGoogle = require('passport-google-oauth')
const config = require('../config')
const User = require('../../models/user')

const passportConfig = {
  clientID: config.authentication.google.clientId,
  clientSecret: config.authentication.google.clientSecret,
  callbackURL: config.authentication.google.callbackURL
}

if (passportConfig.clientID) {
  passport.use(new passportGoogle.OAuth2Strategy(passportConfig, function (request, accessToken, refreshToken, profile, done) {
    // Creates user if this user does not already have an account with this googleId
    User.findOrCreate({
      providerId: profile.id
    }, function (err, user) {

      // After retrieving the user (or creating the user), we add the names if they do not exist
      if (!user.firstName) {
        user.updateFirstName(profile.name.givenName)
      }
      if (!user.lastName) {
        user.updateLastName(profile.name.familyName)
      }

      // Adds avatar from the provider if the user does not have one (if the user does not have a profile picture, they'll have the default picture)
      if (user.avatar === 'https://i.imgur.com/54Uw1Vi.png') {
        user.updateAvatarURL(profile._json.picture)
      }

      // Adds email from the provider if the user does not already have one
      if (!user.email) {
        user.updateEmail(profile.emails[0].value)
      }

      return done(err, user)
    })
  }))
}