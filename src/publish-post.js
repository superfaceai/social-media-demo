const { SuperfaceClient } = require('@superfaceai/one-sdk');

const sdk = new SuperfaceClient();

async function publish(providerName, inputs, accessToken) {
  // Load the installed profile
  const profile = await sdk.getProfile('social-media/publish-post');

  // Load provider
  const provider = await sdk.getProvider(providerName);

  // Use the profile
  const result = await profile
    .getUseCase('PublishPost')
    .perform({ ...inputs, accessToken }, { provider });

  return result.unwrap();
}

async function getPages(providerName, accessToken) {
  // Load the installed profile
  const profile = await sdk.getProfile('social-media/get-pages');

  // Load provider
  const provider = await sdk.getProvider(providerName);

  // Use the profile
  const result = await profile
    .getUseCase('GetPages')
    .perform({ accessToken }, { provider });

  return result.unwrap();
}

function getFeed(providerName, page) {
  let feed;
  if (providerName === 'facebook') {
    feed = {
      pageId: page.id,
    };
  } else {
    feed = {
      businessAccountId: page.businessAccountId,
    };
  }

  return feed;
}

module.exports = async function (req, res) {
  try {
    const providerName = req.body.provider;

    const { pages } = await getPages(providerName, req.user.accessToken);

    if (!pages.length) {
      res.render('publish-post', {
        user: req.user,
        success: false,
        error: {
          title: 'User account has no pages connected',
        },
      });
      return;
    }

    //In this example we publish post to the first page
    let feed = getFeed(providerName, pages[0]);

    const result = await publish(
      providerName,
      {
        feed,
        text: req.body['post-message'],
        imageUrl: req.body['post-image-url'],
      },
      req.user.accessToken
    );

    res.render('publish-post', {
      user: req.user,
      success: true,
      postId: result.postId,
    });
  } catch (error) {
    console.error(error);
    res.render('publish-post', {
      user: req.user,
      success: false,
      error: {
        title: error.properties?.title ?? error.message,
        detail: error.properties?.detail,
      },
    });
  }
};
