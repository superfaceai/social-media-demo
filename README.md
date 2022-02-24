# Social media demo

This repository demonstrates publishing posts on Facebook and Instagram social media networks using Superface OneSDK.

## Setup

- yarn install
- cp .env.example .env
- set credentials in .env file (see below)
- yarn start or yarn start:dev
- visit http://localhost:3000

## Social media applications setup

To use the demo or Superface use-cases in your project you will need to register an application with respective social media to obtain application ID and secret.

We recommend to try the demo with dedicated testing social media profiles.

### Facebook

To be able to publish posts to Facebook and Instagram you have to create a Facebook application. Follow the steps below to create a Facebook application:

- go to https://developers.facebook.com/ and login with existing Facebook account or create new one
- once logged in Facebook visit https://developers.facebook.com/apps
- create new Facebook app
- add `Facebook Login` product to Facebook app and choose `WEB` app type
- configure `Facebook Login` site url to `http://localhost:3000`
- copy and paste app ID and secret from application basic settings to `.env` file
- (optional) create a Facebook page for testing purposes under your Facebook account

### Instagram

Instagram Graph API allows to publish posts only to Business accounts linked with Facebook page. Follow steps bellow to setup such Instagram account.

- go to https://www.instagram.com/ and login or create new account
- go to Instagram account settings and switch the account to professional
- go to Facebook page settings
- in the Facebook page settings select Instagram and connect your Instagram account with Facebook page

### Twitter

- go to https://developer.twitter.com/ and either sign up for a new account or sign in with existing one
- sign up for Essential access; you will need to verify a phone number for your Twitter account
- create a project and application (Essential account is limited to a single project and application)
- in application settings generate OAuth 2.0 Client ID and Client Secret and paste them into `.env` file; mind that you cannot view the secret again later, only regenerate it

### LinkedIn

- create a new app via https://developer.linkedin.com/
- preferably link and verify the app with an existing LinkedIn page
- on Auth page
  - copy Client ID and Client Secret to `.env`
  - add `http://localhost:3000/auth/linkedin/callback` in "Authorized redirect URLs for your app" section
- on Products page, add the following products to your application: "Sign In with LinkedIn", "Marketing Developer Platform" (you can also add "Share on LinkedIn" which, however, is intended for sharing content on personal profiles)
- fill in the "Access Request Form" for Marketing Developer Platform and wait a few days for confirmation by LinkedIn

## Using the demo app

- start the app `yarn start:dev`
- visit http://localhost:3000
- click login with Facebook and login with the same Facebook account under witch you created the Facebook application
- consent with access to above created Facebook page and Instagram account
- go to Publish post page and use it to publish posts to Facebook or Instagram

## Use in your project

### Superface setup

Setup [OneSDK](https://github.com/superfaceai/one-sdk-js) and `super.json` configuration for the relevant profiles and providers:

1. Install OneSDK in your project:

   ```
   npm install @superfaceai/one-sdk
   ```

2. Install social media profiles with [Superface CLI](https://github.com/superfaceai/cli):

   ```
   npx @superfaceai/cli install social-media/publishing-profiles
   npx @superfaceai/cli install social-media/publish-post
   ```

3. Configure providers you want to use (repeat with `instagram` and `twitter` instead of `facebook`):

   ```
   npx @superfaceai/cli configure facebook -p social-media/publishing-profiles
   npx @superfaceai/cli configure facebook -p social-media/publish-post
   ```

### Getting access tokens

Superface and OneSDK at this point doesn't handle authorization flow. In this demo we rely on [Passport.js](http://www.passportjs.org/) library to obtain the access tokens. Check the implementation in [src/app.js](src/app.js) and [src/auth](src/auth).

Currently we use a custom Passport strategy for Twitter due to non-standard header use in Twitter's OAuth 2.0 flow.

You can also obtain access tokens through other means and libraries, like official SDK from the respective provider, integration for your framework, or [Grant OAuth Proxy](https://github.com/simov/grant).

For Facebook and Instagram you can obtain access token and profile ID via [Graph API Explorer](https://developers.facebook.com/tools/explorer) (mind though the access tokens have limited lifetime).

### OAuth scopes

Pay attention to the authorization scopes requested by your application. In this demo we use the following scopes (not all of them are used by the current profiles though):

- Facebook & Instagram:

  ```js
  [
    //Facebook scopes required to publish posts and list pages
    'pages_show_list',
    'read_insights',
    'pages_read_engagement',
    'pages_manage_posts',
    'pages_read_user_content',

    //Instagram scopes required to publish posts
    'instagram_basic',
    'instagram_manage_comments',
    'instagram_manage_insights',
    'instagram_content_publish',
  ];
  ```

- Twitter:

  ```js
  [
    //Scopes required to publish post
    'tweet.write',

    //Scopes required to get followers
    'follows.read',

    //Scopes required to publish post and get followers
    'tweet.read',
    'users.read',

    //Scopes required to get refresh token
    'offline.access',
  ];
  ```

## Code Examples

Check the module [src/sf/use-cases.js](src/sf/use-cases.js) for convenience wrappers over OneSDK calls. Use them for inspiration in your own project.

Check [Superface documentation](https://superface.ai/docs/getting-started) on how to work with OneSDK and [contact us](https://superface.ai/support) if anything's unclear.

### Listing profiles for publishing

Returns a list of social media profiles the user has access to for publishing. Profile's ID is needed for other use-cases.

```js
import { SuperfaceClient } from '@superfaceai/one-sdk';

const sdk = new SuperfaceClient();

const PROVIDER_NAME = 'instagram'; // or 'facebook' or 'twitter
const ACCESS_TOKEN = '<PASTE HERE>'; // user access token

async function getProfilesForPublishing(providerName, accessToken) {
  const profile = await sdk.getProfile('social-media/publishing-profiles');
  const provider = await sdk.getProvider(providerName);

  const result = await profile
    .getUseCase('GetProfilesForPublishing')
    .perform(null, { provider, parameters: { accessToken } });

  return result.unwrap()?.profiles;
}

getProfilesForPublishing(PROVIDER_NAME, ACCESS_TOKEN)
  .then(console.log)
  .catch(console.error);
```

Produces output like:

```js
[
  {
    id: '17841450841275119',
    name: 'SF Test',
    username: 'sftest23894729',
    imageUrl:
      'https://scontent.fprg5-1.fna.fbcdn.net/v/t51.2885-15/271344010_301017881962514_1451837659598750738_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=86c713&_nc_ohc=IIFO9JlwScgAX9RxmG4&_nc_ht=scontent.fprg5-1.fna&edm=AJdBtusEAAAA&oh=00_AT-A2X51mPtXWdmVdj5HtcLACp6C_-89ricCvRGIAKTxbQ&oe=61E0519A',
  },
];
```

### Publish post with image

```js
import { SuperfaceClient } from '@superfaceai/one-sdk';

const sdk = new SuperfaceClient();

const PROVIDER_NAME = 'instagram'; // or 'facebook' or 'twitter
const ACCESS_TOKEN = '<PASTE HERE>'; // user access token

const INPUT = {
  profileId: '<PASTE HERE>', // profile ID (e.g. Instagram account, Facebook page; can be omitted for Twitter)
  text: `Test publishing`,
  link: 'https://example.com', // Will be either attached (if supported), concatenated is text or, in case of Instagram, ignored (because IG doesn't make links in captions clickable)
  media: [
    {
      url: 'https://placekitten.com/500/500',
      altText: 'Kitten',
    },
  ],
};

async function publishPost(providerName, input, accessToken) {
  const profile = await sdk.getProfile('social-media/publish-post');

  const provider = await sdk.getProvider(providerName);

  const result = await profile
    .getUseCase('PublishPost')
    .perform(input, { provider, parameters: { accessToken } });

  return result.unwrap();
}

publishPost(PROVIDER_NAME, INPUT, ACCESS_TOKEN).catch(console.error);
```

Produces output like:

```js
{
  postId: '17927610019999944',
  url: 'https://www.instagram.com/p/CYi8mz8Kk-o/'
}
```

## Current limitations

See the issue [Current Limitations](https://github.com/superfaceai/social-media-demo/issues/11).
