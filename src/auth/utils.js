function createVerifyCallback() {
  return function verifyCallback(
    req,
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    if (!done) {
      throw new TypeError(
        'Missing req in verifyCallback; did you enable passReqToCallback in your strategy?'
      );
    }
    const provider = profile.provider;
    if (!provider) {
      throw new TypeError('Missing strategy provider name');
    }
    const existingUser = req.user || {};
    // To keep the example simple, the user's profile is returned to
    // represent the logged-in user. In a typical application, you would want
    // to associate the provider's account with a user record in your database,
    // and return that user instead.
    return done(null, {
      ...existingUser,
      displayName: profile.displayName,
      [provider]: { profile, accessToken, refreshToken },
    });
  };
}

module.exports = { createVerifyCallback };
