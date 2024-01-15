import { Router } from "express";
import { VideoController } from "../../controllers/videoTranscoder";
import { uploadFile } from "../../middleware/uploadFile";

const router = Router();

router.post("/upload", uploadFile, VideoController.uploadVideo);
