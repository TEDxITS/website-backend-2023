import express, {Express, Request, Response} from "express";
import cors from "cors";
import {config} from "dotenv";
import {
    StatusCodes,
} from 'http-status-codes';

import { sendOk } from "./helper/ApiResponse";

config();

const app: Express = express()
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.get("/", (req: Request, res: Response) =>  {
    sendOk(res, StatusCodes.OK, "TEDxITS 2023 API")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})