import { NextFunction, Request, Response } from "express";
import multer from "multer";

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
	const upload = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "./src/uploads");
		},
		filename: (req, file, cb) => {
			cb(null, file.originalname);
		},
	});
};
