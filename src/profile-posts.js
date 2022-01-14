const { getProfilePosts } = require('./sf/use-cases');
const { getAccessTokenByProviderName } = require('./utils');

async function getProfilePostsWithFormData(body, accessToken) {
  const { providerName, profileId, page } = body;

  const input = {
    profileId,
    page,
  };
  return getProfilePosts(providerName, input, accessToken);
}

module.exports = async function getProfilePostsRoute(req, res, next) {
  const { providerName } = req.body;

  try {
    const accessToken = getAccessTokenByProviderName(providerName, req);

    if (!accessToken) {
      res.render('profile-posts', {
        user: req.user,
        success: false,
        error: {
          title: 'User not logged in for selected provider',
        },
      });
      return;
    }

    const result = await getProfilePostsWithFormData(req.body, accessToken);

    res.render('profile-posts', {
      user: req.user,
      providerName,
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
      providerName,
      success: false,
      error: {
        title: error.properties?.title ?? error.message,
        detail: error.properties?.detail,
      },
    });
  }
};
