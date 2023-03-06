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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true },
    password: String,
    name: String,
    email: { type: String, unique: true },
    googleId: { type: String, unique: true },
    facebookId: { type: String, unique: true },
}, { timestamps: true });
userSchema.statics.createSecure = function (username, password, name, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        const hash = yield bcrypt_1.default.hash(password, saltRounds);
        const user = new this({
            username,
            password: hash,
            name,
            email,
        });
        yield user.save();
        return user;
    });
};
userSchema.statics.authenticate = function (username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ username });
        if (!user) {
            return null;
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return null;
        }
        return user;
    });
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
