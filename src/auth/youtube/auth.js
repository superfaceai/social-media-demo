var YoutubeV3Strategy = require('passport-youtube-v3').Strategy;
const { createVerifyCallback } = require('../utils');

module.exports = function () {
  return new YoutubeV3Strategy(
    {
      clientID: process.env.YOUTUBE_APP_ID,
      clientSecret: process.env.YOUTUBE_APP_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/youtube/callback`,
      scope: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.upload',
      ],
      passReqToCallback: true,
    },
    createVerifyCallback()
  );
};
