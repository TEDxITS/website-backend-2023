import express, {Express, Request, Response} from "express";
import cors from "cors";
import {
    StatusCodes,
} from 'http-status-codes';

import env from "./config/LoadEnv";
import { sendOk } from "./helper/ApiResponse";

const app: Express = express()
const PORT = env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (_: Request, res: Response) =>  {
    sendOk(res, StatusCodes.OK, "TEDxITS 2023 API")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})