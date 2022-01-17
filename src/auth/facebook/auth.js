const FacebookStrategy = require('passport-facebook').Strategy;
const { createVerifyCallback } = require('../utils');

module.exports = function () {
  return new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
      passReqToCallback: true,
    },
    createVerifyCallback()
  );
};
