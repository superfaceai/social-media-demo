const sdk = require('./sdk');

const ALLOWED_PROVIDERS = new Set([
  'facebook',
  'instagram',
  'twitter',
  'linkedin',
]);

function checkAllowedProvider(provider) {
  if (!provider || !ALLOWED_PROVIDERS.has(provider)) {
    throw new Error(`Missing or unsupported provider "${provider}"`);
  }
}

async function getProfilesForPublishing(providerName, accessToken) {
  checkAllowedProvider(providerName);
  const profile = await sdk.getProfile('social-media/publishing-profiles');

  const provider = await sdk.getProvider(providerName);

  const result = await profile
    .getUseCase('GetProfilesForPublishing')
    .perform(null, { provider, parameters: { accessToken } });

  return result.unwrap()?.profiles;
}

async function publishPost(providerName, input, accessToken) {
  const profile = await sdk.getProfile('social-media/publish-post');

  const provider = await sdk.getProvider(providerName);

  const result = await profile
    .getUseCase('PublishPost')
    .perform(input, { provider, parameters: { accessToken } });

  return result.unwrap();
}

async function getProfilePosts(providerName, input, accessToken) {
  const profile = await sdk.getProfile('social-media/posts');

  const provider = await sdk.getProvider(providerName);

  const result = await profile
    .getUseCase('GetProfilePosts')
    .perform(input, { provider, parameters: { accessToken } });

  return result.unwrap();
}

async function getFollowers(providerName, input, accessToken) {
  const profile = await sdk.getProfile('social-media/followers');

  const provider = await sdk.getProvider(providerName);

  const result = await profile
    .getUseCase('GetFollowers')
    .perform(input, { provider, parameters: { accessToken } });

  return result.unwrap();
}

module.exports = {
  getProfilesForPublishing,
  publishPost,
  getProfilePosts,
  getFollowers,
};
