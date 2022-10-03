const TiktokStrategy = require('passport-tiktok-auth').Strategy;
const { createVerifyCallback } = require('../utils');

module.exports = function buildTiktokStrategy() {
  return new TiktokStrategy(
    {
      clientID: process.env.TIKTOK_CLIENT_ID,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET,
      scope: ['user.info.basic'],
      callbackURL: `${process.env.BASE_URL}/auth/tiktok/callback`,
      passReqToCallback: true,
    },
    createVerifyCallback()
  );
};
