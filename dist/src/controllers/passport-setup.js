"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user")); // this is your user model
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    user_1.default.findById(id, (err, user) => {
        done(err, user);
    });
});
passport_1.default.use(new passport_google_oauth20_1.default({
    // configure your Google credentials here
    clientID: '<your-client-id>',
    clientSecret: '<your-client-secret>',
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    // find or create the user in your database
    const existingUser = yield user_1.default.findOne({ googleId: profile.id });
    if (existingUser) {
        return done(null, existingUser);
    }
    const user = new user_1.default({
        googleId: profile.id,
        name: profile.displayName,
    });
    yield user.save();
    done(null, user);
})));
passport_1.default.use(new passport_facebook_1.default({
    // configure your Facebook credentials here
    clientID: '<your-client-id>',
    clientSecret: '<your-client-secret>',
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email'],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    // find or create the user in your database
    const existingUser = yield user_1.default.findOne({ facebookId: profile.id });
    if (existingUser) {
        return done(null, existingUser);
    }
    const user = new user_1.default({
        facebookId: profile.id,
        name: profile.displayName,
    });
    yield user.save();
    done(null, user);
})));
passport_1.default.use(new passport_local_1.default((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    // find the user in your database
    const user = yield user_1.default.findOne({ username });
    if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
    }
    // compare the password with the stored hash
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match) {
        return done(null, false, { message: 'Incorrect username or password.' });
    }
    done(null, user);
})));
