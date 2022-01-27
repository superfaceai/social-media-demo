const { providers } = require('./config');

function getAccessTokenByProviderName(providerName, req) {
  switch (providerName) {
    case 'facebook':
    case 'instagram':
      return req.user.facebook?.accessToken;
    default:
      return req.user[providerName]?.accessToken;
  }
}

function getDefaultProvider(req) {
  //default provider is the first logged in provider
  for (provider of providers) {
    if (req.user[provider.id]) {
      return provider.id;
    }
  }

  return 'facebook'; //fallback to facebook if no provider is logged in
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = {
  getAccessTokenByProviderName,
  ensureAuthenticated,
  getDefaultProvider,
};
