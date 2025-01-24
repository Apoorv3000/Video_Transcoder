import { Router } from "express";
import video from "./videoTranscoder";

const router = Router({ mergeParams: true });

router.use("/video", video);

export default router;
