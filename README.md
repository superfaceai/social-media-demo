# Social media demo

This repository demonstrates publishing posts on Facebook and Instagram social media networks using Superface OneSDK.

## Setup

- yarn install
- cp .env.example .env
- set credentials in .env file (see below)
- yarn start or yarn start:dev
- visit http://localhost:3000

## Facebook application setup

To be able to publish posts to Facebook and Instagram you have to create Facebook application. Follow steps bellow to create Facebook testing application.

- go to https://developers.facebook.com/ and login with existing Facebook account or create new one
- once logged in Facebook visit https://developers.facebook.com/apps
- create new Facebook app
- add `Facebook Login` product to Facebook app and choose `WEB` app type
- configure `Facebook Login` site url to `http://localhost:3000`
- copy paste app id and secret from application basic settings to `.env` file
- create new Facebook page (for testing purposes) under your Facebook account

## Instagram setup

Instagram Graph API allows to publish posts only to Business accounts linked with Facebook page. Follow steps bellow to setup such Instagram account.

- go to https://www.instagram.com/ and create new account
- go to Instagram account settings and switch the account to professional
- go to Facebook page (previously created for testing purposes) settings
- in Facebook page settings select Instagram and connect your Instagram account with Facebook page

## Using the demo app

- start the app `yarn start:dev`
- visit http://localhost:3000
- click login with Facebook and login with the same Facebook account under witch you created the Facebook application
- consent with access to above created Facebook page and Instagram account
- go to Publish post page and use it to publish posts to Facebook or Instagram
