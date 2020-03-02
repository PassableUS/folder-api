const jwt = require("jsonwebtoken");
const config = require("../config");

// Generate an Access Token for the given User ID
function generateAccessJWT(userId) {
  // Time until token expires
  const expiresIn = "2 days";
  // Issuer of token
  const issuer = config.authentication.token.issuer;
  // Intended audience/service for token
  const audience = config.authentication.token.audience;
  // Signing key for token
  const secret = config.authentication.token.secret;

  const token = jwt.sign({}, secret, {
    expiresIn: expiresIn,
    audience: audience,
    issuer: issuer,
    subject: userId.toString()
  });

  return token;
}

module.exports = {
  generateAccessJWT
};
