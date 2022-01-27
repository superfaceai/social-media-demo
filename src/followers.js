const { getProfilesForPublishing, getFollowers } = require('./sf/use-cases');
const { getAccessTokenByProviderName, getDefaultProvider } = require('./utils');

module.exports = async function getFollowersRoute(req, res, next) {
  let { provider, profileId, page } = req.query;

  if (!provider) {
    provider = getDefaultProvider(req);
  }

  let profiles = undefined;

  try {
    const accessToken = getAccessTokenByProviderName(provider, req);

    if (!accessToken) {
      res.render('followers', {
        user: req.user,
        success: false,
        profiles,
        provider,
        error: {
          title: 'User not logged in for selected provider',
        },
      });
      return;
    }

    profiles = await getProfilesForPublishing(provider, accessToken);

    if (!profileId) {
      profileId = profiles[0].id;
    }

    const result = await getFollowers(
      provider,
      { profileId, page },
      accessToken
    );

    res.render('followers', {
      user: req.user,
      profiles,
      provider,
      success: true,
      result,
      followers: result.followers,
      previousPage: result.previousPage,
      nextPage: result.nextPage,
      profileId: req.body.profileId,
    });
  } catch (error) {
    console.error(error);
    res.render('followers', {
      user: req.user,
      profiles,
      provider,
      success: false,
      error: {
        title: error.properties?.title ?? error.message,
        detail: error.properties?.detail,
      },
    });
  }
};
