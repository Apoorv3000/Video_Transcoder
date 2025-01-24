import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffProbeInstaller from "@ffprobe-installer/ffprobe";
import path from "path";
import fs from "fs";
export class videoTranscoder {
	private inputPath: string;
	private outputPath: string;

	constructor(inputPath: string, outputPath: string) {
		this.inputPath = inputPath;
		this.outputPath = outputPath;
	}

	public transcodeToHLS(outputOptions: string[], qualityLevels: { bitrate: string; resolution: string }[]): Promise<{ quality: { bitrate: string; resolution: string }; outputPath: string }[]> {
		const promises: Promise<{ quality: { bitrate: string; resolution: string }; outputPath: string }>[] = [];

		qualityLevels.forEach((quality, index) => {
			const outputDir = path.resolve(this.outputPath, `quality_${quality.bitrate}`);
			const manifestPath = path.join(outputDir, "output.m3u8");
			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true });
			}
			const promise = new Promise<{ quality: { bitrate: string; resolution: string }; outputPath: string }>((resolve, reject) => {
				ffmpeg(this.inputPath)
					.setFfmpegPath(ffmpegInstaller.path)
					.setFfprobePath(ffProbeInstaller.path)
					.inputFormat("mp4")
					.inputOptions(["copyts"])
					.on("start", function (command) {
						console.log("Start: ", command);
					})
					.videoCodec("libx264")
					.audioCodec("aac")
					.outputOptions(outputOptions)
					.output(manifestPath)
					.on("end", () => resolve({ quality, outputPath: this.outputPath }))
					.on("error", function (err, stdout, stderr) {
						console.log("Cannot process video: " + err.message);
						console.log(err);
						console.log(stdout);
						console.log(stderr);
						reject(err);
					})
					.on("progress", function (progress) {
						console.log("Processing: " + progress.percent + "% done");
						console.log("Processing: " + progress.targetSize + " KB converted");
					})
					.save(this.outputPath)
					.run();
			});

			promises.push(promise);
		});

		return Promise.all(promises);
	}
}
