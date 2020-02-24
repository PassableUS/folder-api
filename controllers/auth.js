const authRouter = require('express').Router()
const passport = require('passport')
const token = require('../utils/authentication/token')
const config = require('../utils/config')
const bcrypt = require('bcrypt')

require('../utils/authentication/jwt')
require('../utils/authentication/google')
require('../utils/authentication/facebook')
require('../utils/authentication/local')

function generateUserJWTAndRedirect(req, res) {
  console.log("GENERATING JWT AND REDIRECTING")
  const accessJWT = token.generateAccessJWT(req.user.id)
  console.log("GENERATED ACCESS JWT " + accessJWT + "ATTEMPTING TO REDIRECT")
  console.log("REDIRECTING TO: " + `${config.frontendUrl}/auth/login?token=${accessJWT}`)
  res
    .status(200)
    .redirect(`${config.frontendUrl}/auth/login?token=${accessJWT}`)
}

const registerUserByEmailAndPassword = async (req, res) => {
  const user = req.body
  console.log("USER:", user)

  // Generate hashed password
  const saltRounds = 10
  const passwordHash = await

  res
    .status(200)
    .redirect('/auth/login')
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

// Register User Routes
authRouter.post('/local/start',
  registerUserByEmailAndPassword)

// Local Authentication Routes
authRouter.get('/local/redirect',
  passport.authenticate('local', { session: false }),
  generateUserJWTAndRedirect)

module.exports = authRouter