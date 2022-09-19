require('dotenv').config();

const express = require('express');
const https = require('https');
const fs = require('fs');
const passport = require('passport');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const buildFacebookStrategy = require('./auth/facebook/auth');
const buildTwitterStrategy = require('./auth/twitter/auth');
const buildLinkedInStrategy = require('./auth/linkedin/auth');
const { getProfilesForPublishing } = require('./sf/use-cases');
const config = require('./config');

const {
  getAccessTokenByProviderName,
  ensureAuthenticated,
  getDefaultProvider,
} = require('./utils');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is
//   serialized and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the Facebook within Passport.
if (process.env.FACEBOOK_CLIENT_ID) {
  passport.use(buildFacebookStrategy());
}

//Use the Twitter OAuth2 strategy within Passport.
if (process.env.TWITTER_CLIENT_ID) {
  passport.use(buildTwitterStrategy());
}

if (process.env.LINKEDIN_CLIENT_ID) {
  passport.use(buildLinkedInStrategy());
}

const app = express();

app.locals.providers = config.providers;

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: 'views/layout.ejs' });
app.use(expressLayouts);
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: 'keyboard cat', resave: false, saveUninitialized: true })
);
// Initialize Passport
app.use(passport.initialize());
// Also use passport.session() middleware, to support persistent login sessions (recommended).
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function (req, res) {
  res.render('account', { user: req.user });
});

app.get('/login', function (req, res) {
  res.render('login', { user: req.user });
});

app.get('/publish-post', ensureAuthenticated, async function (req, res, next) {
  const providerName = req.query.provider || getDefaultProvider(req);
  let profiles = [];
  try {
    const accessToken = getAccessTokenByProviderName(providerName, req);
    profiles = await getProfilesForPublishing(providerName, accessToken);
  } catch (err) {
    console.error(err);
    next(err);
    return;
  }
  res.render('publish-post', {
    user: req.user,
    providerName,
    profiles,
    success: undefined,
  });
});

app.post('/publish-post', ensureAuthenticated, require('./publish-post'));

app.get('/profile-posts', ensureAuthenticated, require('./profile-posts'));

app.get('/followers', ensureAuthenticated, require('./followers'));

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook
//   will redirect the user back to this application at /auth/facebook/callback
app.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: [
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
    ],
  }),
  function (req, res) {
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  }
);
// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  }
);

//#endregion

//#region Twitter routes
app.get(
  '/auth/twitter',
  passport.authenticate('twitter', {
    scope: [
      'tweet.read',
      'tweet.write',
      'users.read',
      'offline.access',
      'follows.read',
    ],
  }),
  function (req, res) {
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  }
);

// GET /auth/twitter/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  }
);
//#endregion

//#region LinkedIn routes
app.get(
  '/auth/linkedin',
  passport.authenticate('linkedin', {
    scope: [
      'r_liteprofile',
      'r_organization_social',
      'w_organization_social',
      'rw_organization_admin',
    ],
  }),
  function (req, res) {
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  }
);
app.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  }
);
//#endregion

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;
  res.locals.user = req.user;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

https
  .createServer(
    {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
    },
    app
  )
  .listen(3000);
