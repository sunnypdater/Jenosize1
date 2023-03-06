import express, { Request, Response } from 'express';
import {validateAuthToken} from './middlewares/validateAuthToken'
import {Game24, PlacesApiResponse, PlacesController, getDist1} from './controllers/jenosize.controller'

import {Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as LocalStrategy} from 'passport-local';
import session from 'express-session';
import passport from 'passport';

import jwt from 'jsonwebtoken';
import './passport-setup'; // import the passport.js configuration

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// const controller = new PlacesController("AIzaSyC9kSQZw-WnCbS3gDBIXhRYfhP5XxTzhHM"); // replace with your actual API key
const controller = new PlacesController("AIzaSyCtZQDPtPsavyOJoQdVT-o__n1ei9towiQ"); // replace with your actual API key

// configure the session middleware
app.use(
    session({
        secret: process.env.JWT_SECRET ? process.env.JWT_SECRET: "",
        resave: false,
        saveUninitialized: false,
    })
);

// initialize passport.js and the session middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
// app.use(validateAuthToken);


interface User {
    id: number | undefined;
}

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user:any, done) => {
    done(null, user);
  });

passport.use(
  new GoogleStrategy(
    {
      // configure your Google credentials here
      clientID: '527460591477-lj2am1m4ohslct24h6hmdoaio7et87np.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        done(null, { id: Number(profile.id), name: profile.displayName });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      // configure your Facebook credentials here
      clientID: '1249929752269721',
      clientSecret: '395af74c86bf9b6a4ba989b6c2220885',
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email'],
    },
    async (accessToken, refreshToken, profile:any, done) => {
        done(null, { id: profile.id, name: profile.displayName, email: profile.emails[0].value });
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    // find the user in your database
    // Use the username and password to authenticate the user
  // You can check the credentials against your database
  if (username === 'user@example.com' && password === 'password') {
    done(null, { id: 1, email: username });
  } else {
    done(null, false);
  }
  })
);

// Google authentication
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.JWT_SECRET ? process.env.JWT_SECRET: "" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user?.id }, "sssdddd");
    res.redirect(`http://localhost:4200/login/success?token=${token}`);
  }
);

// Facebook authentication
app.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: process.env.JWT_SECRET ? process.env.JWT_SECRET: "" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user?.id }, "sssdddd");
    res.redirect(`http://localhost:4200/login/success?token=${token}`);
  }
);

// Local authentication
app.post('/login', passport.authenticate('local'), (req, res) => {
  const token = jwt.sign({ id: req.user?.id }, "sssdddd");
  res.json({ token });
});


app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});

app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World!');
});
app.get('/dist1', getDist1);
app.post('/game24', Game24);

app.get('/places/search', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  try {
    const response: PlacesApiResponse = await controller.searchPlaces(query);
    res.json(response);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    let errorMessage = "Failed to do something exceptional";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.log(errorMessage);

  }
});


app.listen(PORT, () => console.log('listening on port',PORT));
