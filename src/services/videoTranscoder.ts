import ffmpeg from "fluent-ffmpeg";
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
			const outputPath = `${this.outputPath}/output_${index}.m3u8`;

			const promise = new Promise<{ quality: { bitrate: string; resolution: string }; outputPath: string }>((resolve, reject) => {
				ffmpeg(this.inputPath)
					.inputFormat("mp4")
					.inputOptions(["-preset fast", "-tune film"])
					.videoCodec("libx264")
					.audioCodec("aac")
					.outputOptions(outputOptions)
					.output(outputPath)
					.on("end", () => resolve({ quality, outputPath }))
					.on("error", (err) => reject(err))
					.run();
			});

			promises.push(promise);
		});

		return Promise.all(promises);
	}
}
