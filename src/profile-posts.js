const { getProfilePosts, getProfilesForPublishing } = require('./sf/use-cases');
const { getAccessTokenByProviderName, getDefaultProvider } = require('./utils');

module.exports = async function getProfilePostsRoute(req, res, next) {
  let { provider, profileId, page } = req.query;

  if (!provider) {
    provider = getDefaultProvider(req);
  }

  let profiles = undefined;

  try {
    const accessToken = getAccessTokenByProviderName(provider, req);

    if (!accessToken) {
      res.render('profile-posts', {
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

    const result = await getProfilePosts(
      provider,
      { profileId, page },
      accessToken
    );

    res.render('profile-posts', {
      user: req.user,
      profiles,
      provider,
      success: true,
      result,
      posts: result.posts,
      previousPage: result.previousPage,
      nextPage: result.nextPage,
      profileId: req.body.profileId,
    });
  } catch (error) {
    console.error(error);
    res.render('profile-posts', {
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
