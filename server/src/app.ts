import express, { Application } from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import errorMiddleware from "@middlewares/error.middleware";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);
app.use(errorMiddleware);

export default app;
