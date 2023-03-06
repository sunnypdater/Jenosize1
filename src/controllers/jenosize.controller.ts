import { RequestHandler } from 'express'
import axios from 'axios';

export interface PlacesApiResponse {
    results: {
      name: string;
      formatted_address: string;
      // add more fields as needed
    }[];
  }

export const getDist1:RequestHandler = (req, res, next) => {
    return res.status(200).json({ message: `The user by email sunnypdater was successfully registered` });
};

export class PlacesController {
    private readonly API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';
    
    constructor(private readonly apiKey: string) {}
    
    async searchPlaces(query: string): Promise<PlacesApiResponse> {
        const url = `${this.API_BASE_URL}/textsearch/json`;
        const response = await axios.get(url, {
            params: {
                key: this.apiKey,
                query,
            },
        });
        return response.data as PlacesApiResponse;
    }
    
    async getPlaceDetails(placeId: string): Promise<PlacesApiResponse['results'][0]> {
        const url = `${this.API_BASE_URL}/details/json`;
        const response = await axios.get(url, {
            params: {
                key: this.apiKey,
                place_id: placeId,
            },
        });
        return response.data.result as PlacesApiResponse['results'][0];
    }
}

export const Game24:RequestHandler = (req, res, next) => {
    return res.status(200).json({ 
        body: calculate24(req.body.data)
 });
};


function calculate24(nums: number[]): boolean {
    if (nums.length === 1) {
      return Math.abs(nums[0] - 24) < 0.001;
    }
    
    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i === j) continue;
        const newNums = nums.filter((_, index) => index !== i && index !== j);
        const a = nums[i], b = nums[j];
        if (calculate24([...newNums, a + b])) return true;
        if (calculate24([...newNums, a - b])) return true;
        if (calculate24([...newNums, b - a])) return true;
        if (calculate24([...newNums, a * b])) return true;
        if (b !== 0 && calculate24([...newNums, a / b])) return true;
      }
    }
    
    return false;
  }