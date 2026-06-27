import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { env } from "./config/env.js";

const app = express();

app.use(cookieParser());
app.use(
    cors({
        origin:
            process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());

app.use("/api", routes);

export default app