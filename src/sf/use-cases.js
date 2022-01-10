const sdk = require('./sdk');

const ALLOWED_PROVIDERS = new Set(['facebook', 'instagram', 'twitter']);

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

module.exports = {
  getProfilesForPublishing,
};
