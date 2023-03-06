import passport from 'passport';
import {Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcrypt';
import User from './src/models/user'; // this is your user model

interface User {
    id: number | undefined;
}

passport.serializeUser((user:any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err:any, user:any) => {
    done(err, user);
  });
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
      // find or create the user in your database
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = new User({
        googleId: profile.id,
        name: profile.displayName,
      });
      await user.save();
      done(null, user);
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
    async (accessToken, refreshToken, profile, done) => {
      // find or create the user in your database
      const existingUser = await User.findOne({ facebookId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = new User({
        facebookId: profile.id,
        name: profile.displayName,
      });
      await user.save();
      done(null, user);
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    // find the user in your database
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    // compare the password with the stored hash
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    done(null, user);
  })
);
