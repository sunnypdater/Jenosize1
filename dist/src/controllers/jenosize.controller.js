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
exports.Game24 = exports.PlacesController = exports.getDist1 = void 0;
const axios_1 = __importDefault(require("axios"));
const getDist1 = (req, res, next) => {
    return res.status(200).json({ message: `The user by email sunnypdater was successfully registered` });
};
exports.getDist1 = getDist1;
class PlacesController {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';
    }
    searchPlaces(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.API_BASE_URL}/textsearch/json`;
            const response = yield axios_1.default.get(url, {
                params: {
                    key: this.apiKey,
                    query,
                },
            });
            return response.data;
        });
    }
    getPlaceDetails(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.API_BASE_URL}/details/json`;
            const response = yield axios_1.default.get(url, {
                params: {
                    key: this.apiKey,
                    place_id: placeId,
                },
            });
            return response.data.result;
        });
    }
}
exports.PlacesController = PlacesController;
const Game24 = (req, res, next) => {
    return res.status(200).json({
        body: calculate24(req.body.data)
    });
};
exports.Game24 = Game24;
function calculate24(nums) {
    if (nums.length === 1) {
        return Math.abs(nums[0] - 24) < 0.001;
    }
    for (let i = 0; i < nums.length; i++) {
        for (let j = 0; j < nums.length; j++) {
            if (i === j)
                continue;
            const newNums = nums.filter((_, index) => index !== i && index !== j);
            const a = nums[i], b = nums[j];
            if (calculate24([...newNums, a + b]))
                return true;
            if (calculate24([...newNums, a - b]))
                return true;
            if (calculate24([...newNums, b - a]))
                return true;
            if (calculate24([...newNums, a * b]))
                return true;
            if (b !== 0 && calculate24([...newNums, a / b]))
                return true;
        }
    }
    return false;
}
