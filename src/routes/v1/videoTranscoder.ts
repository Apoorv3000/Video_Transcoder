import { Router } from "express";
import { VideoController } from "../../controllers/videoTranscoder";

const router = Router();

router.post("/upload", VideoController.uploadVideo);
