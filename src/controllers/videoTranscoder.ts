import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { videoTranscoder } from "../services/videoTranscoder";

export class VideoController {
	public static uploadVideo = async (req: Request, res: Response) => {
		try {
			if (!req.file) {
				return res.status(400).send("No file uploaded");
			}

			const outputDirName = req.file.originalname.split(path.extname(req.file.originalname))[0];

			const inputFileName = req.file.originalname;
			console.log(inputFileName);
			const inputFilePath = path.resolve(__dirname, `../videos/raw/${inputFileName}`);
			const filename = inputFileName.split(".")[0];
			/**
			 * Directory to store transcoded files
			 * videos
			 * |- raw : video source
			 * |- transcoded
			 *    |- videoName
			 *      |- .hls file
			 *      |- .ts files
			 */
			const outputDir = path.resolve(__dirname, `../videos/transcoded/${outputDirName}`);
			const manifestPath = `${outputDir}/${outputDirName}.m3u8`;

			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true });
			}

			const transcoder = new videoTranscoder(inputFilePath, manifestPath);

			const qualityLevels = [
				{
					bitrate: "2000k",
					resolution: "1280x720",
				},
				{
					bitrate: "1000k",
					resolution: "854x480",
				},
				{
					bitrate: "500k",
					resolution: "640x360",
				},
				{
					bitrate: "250k",
					resolution: "426x240",
				},
			];
			const transcodedVideo = await transcoder.transcodeToHLS(["-preset fast", "-tune film", "-movflags", "faststart", "-hls_time 10", "-hls_list_size 6"], qualityLevels);
			return res.status(200).json({ transcodedVideo });
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	};
}
