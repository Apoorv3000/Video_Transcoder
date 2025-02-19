import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./src/routes";

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.use("/", routes);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
