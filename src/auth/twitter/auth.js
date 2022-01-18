const TwitterStrategy = require('./strategy');
const { createVerifyCallback } = require('../utils');

module.exports = function () {
  return new TwitterStrategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
      passReqToCallback: true,
    },
    createVerifyCallback()
  );
};
