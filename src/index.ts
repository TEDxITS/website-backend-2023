import * as dotenv from "dotenv";
import express, {Express, Request, Response} from "express";
import cors from "cors";

if (process.env.NODE_ENV != "production")
    dotenv.config({ path: __dirname + "/.dev.env" });
else
    dotenv.config();

const app: Express = express()
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "TEDxITS 2023 API",
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})