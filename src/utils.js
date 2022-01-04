function getAccessTokenByProviderName(providerName, req) {
  switch (providerName) {
    case 'facebook':
    case 'instagram':
      return req.user.facebook?.accessToken;
    case 'twitter':
      return req.user.twitter?.accessToken;
  }
}

module.exports = {
  getAccessTokenByProviderName,
};
