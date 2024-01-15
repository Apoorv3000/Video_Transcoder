import { Router } from "express";
import { Request, Response } from "express";
import v1ApiRouter from "./v1/index";

const router = Router();

router.use("/", (req: Request, res: Response, next) => {
	res.json("It works");
});

router.use("/api/v1", v1ApiRouter);
