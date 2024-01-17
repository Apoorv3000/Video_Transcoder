import { NextFunction, Request, Response } from "express";
import multer, { Multer } from "multer";
import path from "path";
import fs from "fs";

const getUploadDirectoryPath = (filename: string) => {
	return path.join(__dirname, "../uploads", filename);
};

const ensureUploadDirPathExist = (filename: string) => {
	const dirPath = getUploadDirectoryPath(filename);
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
	}
};

const storage = multer.diskStorage({
	destination: (req: Request, file: Express.Multer.File, cb) => {
		const fileSpecificFolder = file.originalname.split(path.extname(file.originalname))[0];
		ensureUploadDirPathExist(fileSpecificFolder);
		cb(null, getUploadDirectoryPath(fileSpecificFolder));
	},
	filename: (req: Request, file: Express.Multer.File, cb) => {
		cb(null, file.originalname);
	},
});

export const uploadFile: Multer = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const allowedFileTypes = [".mp4"];
		if (allowedFileTypes.includes(path.extname(file.originalname))) {
			cb(null, true);
		} else {
			cb(new Error("File type not allowed"));
		}
	},
});
