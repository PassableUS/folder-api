const authRouter = require('express').Router()
const passport = require('passport')
const token = require('../utils/authentication/token')
const config = require('../utils/config')

require('../utils/authentication/jwt')
require('../utils/authentication/google')
require('../utils/authentication/facebook')
require('../utils/authentication/local')

function generateUserJWTAndRedirect(req, res) {
  console.log("GENERATING JWT AND REDIRECTING")
  const accessJWT = token.generateAccessJWT(req.user.id)
  res
    .status(200)
    .redirect(`${config.frontendUrl}/auth/login?token=${accessJWT}`)
}

// Google Routes
authRouter.get('/google/start',
  passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }))
authRouter.get('/google/redirect',
  passport.authenticate('google', { session: false }),
  generateUserJWTAndRedirect)

// Facebook Routes
authRouter.get('/facebook/start',
  passport.authenticate('facebook', { session: false }))
authRouter.get('/facebook/redirect',
  passport.authenticate('facebook', { session: false }),
  generateUserJWTAndRedirect)

// Local Authentication Routes
authRouter.get('/local/start',
  passport.authenticate('local', { session: false }),
  generateUserJWTAndRedirect)

module.exports = authRouter