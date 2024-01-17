import ffmpeg from "fluent-ffmpeg";
export class videoTranscoder {
	private outputFile: string;
	private inputFile: string;
	constructor(outputFile: string, inputFile: string) {
		this.outputFile = outputFile;
		this.inputFile = inputFile;
	}

	public static transcodeToHLS = (outputFile: string, inputFile: string) => {};
}
