const { SuperfaceClient } = require('@superfaceai/one-sdk');
const { publishPost } = require('./sf/use-cases');
const { getAccessTokenByProviderName } = require('./utils');

const sdk = new SuperfaceClient();

async function publishWithFormData(body, accessToken) {
  const { providerName, profileId, text, link, mediaUrl } = body;
  const media = [];
  if (mediaUrl) {
    media.push({ url: mediaUrl });
  }
  const input = {
    profileId,
    text,
    link,
    media,
  };
  return publishPost(providerName, input, accessToken);
}

module.exports = async function publishPostRoute(req, res, next) {
  const { providerName } = req.body;

  try {
    const accessToken = getAccessTokenByProviderName(providerName, req);

    if (!accessToken) {
      res.render('publish-post', {
        user: req.user,
        success: false,
        error: {
          title: 'User not logged in for selected provider',
        },
      });
      return;
    }

    const result = await publishWithFormData(req.body, accessToken);

    res.render('publish-post', {
      user: req.user,
      providerName,
      success: true,
      result,
      postId: result.postId,
    });
  } catch (error) {
    console.error(error);
    res.render('publish-post', {
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
