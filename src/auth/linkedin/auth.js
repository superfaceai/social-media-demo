const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { createVerifyCallback } = require('../utils');

module.exports = function buildLinkedInStrategy() {
  return new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/linkedin/callback`,
      // https://github.com/auth0/passport-linkedin-oauth2#auto-handle-state-param
      state: true,
      passReqToCallback: true,
    },
    createVerifyCallback()
  );
};
