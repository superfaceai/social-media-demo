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

async function getFeed(providerName, accessToken) {
  if (providerName === 'twitter') {
    //twitter has single feed which is identified by account id
    return undefined;
  }

  const { pages } = await getPages(providerName, accessToken);

  if (!pages.length) {
    throw Error('User account has no pages connected');
  }

  //In this example we post to first page
  const page = pages[0];

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

function getAccessTokenByProviderName(providerName, req) {
  switch (providerName) {
    case 'facebook':
    case 'instagram':
      return req.user.facebook?.accessToken;
    case 'twitter':
      return req.user.twitter?.accessToken;
  }
}

module.exports = async function (req, res) {
  try {
    const providerName = req.body.provider;

    let accessToken = getAccessTokenByProviderName(providerName, req);

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

    let feed = await getFeed(providerName, accessToken);

    const result = await publish(
      providerName,
      {
        feed,
        text: req.body['post-message'],
        imageUrl: req.body['post-image-url'],
      },
      accessToken
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
