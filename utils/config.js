import dotenv from "dotenv";
dotenv.config();

export const URL = process.env.ATLAS_URI;
export const PORT = process.env.PORT;
export const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const SECRET = process.env.SECRET;
export const BEURL = process.env.BEURL;
export const FEURL = process.env.FEURL;
