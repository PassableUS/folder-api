const passport = require('passport')
const passportFacebook = require('passport-facebook')
const config = require('../config')
const User = require('../../models/user')

const passportConfig = {
  clientID: config.authentication.facebook.clientId,
  clientSecret: config.authentication.facebook.clientSecret,
  callbackURL: config.authentication.facebook.callbackURL,
  profileFields: ['id', 'displayName', 'picture.type(large)', 'email', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link']
}

if (passportConfig.clientID) {
  passport.use(new passportFacebook.Strategy(passportConfig, function (request, accessToken, refreshToken, profile, done) {

    // Splits displayName given by Facebook into first and last names
    const firstName = profile.displayName.split(' ').slice(0, -1).join(' ')
    const lastName = profile.displayName.split(' ').slice(-1).join(' ')

    // Creates user if this user does not already have an account with this facebookId
    // Creates user if this user does not already have an account with this googleId
    User.findOrCreate({
      providerId: profile.id
    }, function (err, user) {

      // After retrieving the user (or creating the user), we add the names if they do not exist
      if (!user.firstName) {
        user.updateFirstName(firstName)
      }
      if (!user.lastName) {
        user.updateLastName(lastName)
      }

      // Adds avatar from the provider if the user does not already have one
      if (user.avatar === 'https://i.imgur.com/54Uw1Vi.png') {
        if (profile.photos) { // No profile photos may be specified
          user.updateAvatarURL(profile.photos[0].value)
        }
      }

      // Adds email from the provider if the user does not already have one
      if (!user.email) {
        if (profile.emails) { // Emails may be undefined if they have not verified their email
          user.updateEmail(profile.emails[0].value)
        }
      }

      return done(err, user)
    })
  }))
}