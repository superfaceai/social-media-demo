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

## Code Examples

Check the module [src/sf/use-cases.js](src/sf/use-cases.js) for convenience wrappers over OneSDK calls. Use them for inspiration in your own project.

For Facebook and Instagram you can also obtain access token and profile ID via [Graph API Explorer](https://developers.facebook.com/tools/explorer).

### Listing profiles for publishing

```js
const { getProfilesForPublishing } = require('./src/sf/use-cases');

const provider = 'instagram'; // or 'facebook'
const accessToken = '<PASTE HERE>'; // User token

async function getProfiles() {
  const profiles = await getProfilesForPublishing(provider, accessToken);
  console.log(profiles);
}

getProfiles().catch(console.error);
```

Produces output like (note the image URL is not permanent):

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

### Publishing Media

```js
const { publishPost } = require('./src/sf/use-cases');

const provider = 'instagram' // or 'facebook'
const accessToken = '<PASTE HERE>'; // User token

const input = {
  profileId: '<PASTE HERE>', // Instagram profile or Facebook page ID
  text: `Test publishing`,
  link: 'https://example.com', // Will be either attached (if supported), concatenated is text or, in case of Instagram, ignored (because IG doesn't make links in captions clickable)
  media: [
    {
      url: 'https://placekitten.com/500/500',
      altText: 'Kitten',
    },
  ],
};

async function publish() {
  const result = await publishPost(provider', input, accessToken);
  console.log(result);
}

publish().catch(console.error);
```

Produces output like:

```js
{
  postId: '17927610019999944',
  url: 'https://www.instagram.com/p/CYi8mz8Kk-o/'
}
```
