const fetch = require('cross-fetch');
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

// Lists providers which require files to be uploaded (i.e. can't just pass an URL for them to fetch)
// FIXME: this should be exposed via dedicated use-case in the profile
const PROVIDERS_FOR_UPLOAD = new Set(['linkedin', 'twitter']);

// Array<{url: string, altText?: string}> => Array<{contents: Buffer, altText?: string}>
async function fetchMedia(media) {
  return Promise.all(
    media.map(async (mediaItem) => {
      if (mediaItem.contents) {
        return mediaItem;
      }
      if (!mediaItem.url) {
        throw new Error('Media without url nor contents');
      }
      const res = await fetch(mediaItem.url);
      const buffer = await res.buffer();
      return {
        ...mediaItem,
        contents: buffer,
      };
    })
  );
}

async function publishPost(providerName, input, accessToken) {
  const profile = await sdk.getProfile('social-media/publish-post');

  const provider = await sdk.getProvider(providerName);
  let { media } = input;
  if (media?.length && PROVIDERS_FOR_UPLOAD.has(providerName)) {
    media = await fetchMedia(media);
  }

  const result = await profile
    .getUseCase('PublishPost')
    .perform({ ...input, media }, { provider, parameters: { accessToken } });

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
