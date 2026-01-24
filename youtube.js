import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const conf = JSON.parse(readFileSync(join(__dirname, "conf.json"), "utf8"));

export async function postRandomYoutubeVideo(channel) {
	const apiToken = conf.randomyoutube.api_token;
	const url = `https://randomyoutube.net/api/getvid?api_token=${apiToken}`;
	try {
		const body = await fetch(url).then(r => r.json());
		if (body && body.vid) {
			const videoUrl = `https://www.youtube.com/watch?v=${body.vid}`;
			await channel.send(videoUrl);
		}
	} catch (err) {
		console.log(`Random YouTube error: ${err}`);
	}
}
