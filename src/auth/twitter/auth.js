const TwitterStrategy = require('@superfaceai/passport-twitter-oauth2');
const { createVerifyCallback } = require('../utils');

module.exports = function () {
  return new TwitterStrategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
      clientType: 'private',
      passReqToCallback: true,
    },
    createVerifyCallback()
  );
};
