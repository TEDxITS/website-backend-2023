import express, {Express, Request, Response} from "express";
import cors from "cors";
import {
    StatusCodes,
} from 'http-status-codes';

import env from "./config/LoadEnv";
import { sendOk } from "./helper/ApiResponse";

import AuthRouter from "./router/AuthRouter";
import { TokenType, generateAccessToken, generateRefreshToken } from "./helper/JWTToken";

const app: Express = express()
const PORT = env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/api", async (_: Request, res: Response) =>  {
    sendOk(res, StatusCodes.OK, "TEDxITS 2023 API")
})

app.get('/gen', async (_: Request, res: Response) => {
    const acc = generateAccessToken(TokenType.ADMIN, {sub: "d64a40f7-568f-", email: "test@mail.com"})
    const ref = generateRefreshToken(TokenType.ADMIN, {sub: "d64a40f7-568f-", email: "test@mail.com"})
    res.status(200).json({acc, ref})
})

app.use("/api/auth", AuthRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})