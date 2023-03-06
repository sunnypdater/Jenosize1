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
const express_1 = __importDefault(require("express"));
const jenosize_controller_1 = require("./controllers/jenosize.controller");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_local_1 = require("passport-local");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import '../passport-setup'; // import the passport.js configuration
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({ secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : "" }));
const PORT = process.env.PORT || 3000;
// const controller = new PlacesController("AIzaSyC9kSQZw-WnCbS3gDBIXhRYfhP5XxTzhHM"); // replace with your actual API key
const controller = new jenosize_controller_1.PlacesController("AIzaSyCtZQDPtPsavyOJoQdVT-o__n1ei9towiQ"); // replace with your actual API key
// configure the session middleware
app.use((0, express_session_1.default)({
    secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : "",
    resave: false,
    saveUninitialized: false,
}));
// initialize passport.js and the session middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
// Serialize and deserialize user
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    // configure your Google credentials here
    clientID: '527460591477-lj2am1m4ohslct24h6hmdoaio7et87np.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/google/callback',
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    done(null, { id: Number(profile.id), name: profile.displayName });
})));
passport_1.default.use(new passport_facebook_1.Strategy({
    // configure your Facebook credentials here
    clientID: '1249929752269721',
    clientSecret: '395af74c86bf9b6a4ba989b6c2220885',
    callbackURL: 'http://localhost:3000/facebook/callback',
    profileFields: ['id', 'displayName', 'email'],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    done(null, { id: profile.id, name: profile.displayName, email: profile.emails[0].value });
})));
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    // find the user in your database
    // Use the username and password to authenticate the user
    // You can check the credentials against your database
    if (username === 'user@example.com' && password === 'password') {
        done(null, { id: 1, email: username });
    }
    else {
        done(null, false);
    }
})));
// Google authentication
app.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: process.env.JWT_SECRET ? process.env.JWT_SECRET : "" }), (req, res) => {
    var _a;
    const token = jsonwebtoken_1.default.sign({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, "sssdddd");
    res.redirect(`http://localhost:3000/login/success?token=${token}`);
});
// Facebook authentication
app.get('/facebook', passport_1.default.authenticate('facebook', { scope: ['email'] }));
app.get('/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: process.env.JWT_SECRET ? process.env.JWT_SECRET : "" }), (req, res) => {
    var _a;
    const token = jsonwebtoken_1.default.sign({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, "sssdddd");
    res.redirect(`http://localhost:3000/login/success?token=${token}`);
});
// Local authentication
app.post('/login', passport_1.default.authenticate('local'), (req, res) => {
    var _a;
    const token = jsonwebtoken_1.default.sign({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, "sssdddd");
    res.json({ token });
});
app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});
app.get('/', (_req, res) => {
    res.send('Hello World!');
});
app.get('/login/success', (_req, res) => {
    res.send('You are login success with : ' + _req.query.token);
});
app.get('/dist1', jenosize_controller_1.getDist1);
app.post('/game24', jenosize_controller_1.Game24);
app.get('/places/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    try {
        const response = yield controller.searchPlaces(query);
        res.json(response);
    }
    catch (error) {
        // res.status(500).json({ error: error.message });
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.log(errorMessage);
    }
}));
app.listen(PORT, () => console.log('listening on port', PORT));
