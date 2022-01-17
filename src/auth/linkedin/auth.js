const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

module.exports = function buildLinkedInStrategy() {
  return new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/linkedin/callback`,
      // https://github.com/auth0/passport-linkedin-oauth2#auto-handle-state-param
      state: true,
    },
    function (accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's LinkedIn profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the LinkedIn account with a user record in your database,
        // and return that user instead.
        return done(null, {
          displayName: profile.displayName,
          linkedin: { profile, accessToken, refreshToken },
        });
      });
    }
  );
};
