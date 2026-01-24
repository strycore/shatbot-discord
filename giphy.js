import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { EmbedBuilder } from "discord.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const conf = JSON.parse(readFileSync(join(__dirname, "conf.json"), "utf8"));

export async function getRandomGif(tag) {
	const apiKey = conf.giphy.api_key;
	const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${tag}`;
	try {
		const response = await fetch(url).then(r => r.json());
		const imageUrl = response?.data?.images?.original?.url;
		if (!imageUrl) {
			console.error("Failed to get image from Giphy");
			return null;
		}
		return new EmbedBuilder().setImage(imageUrl);
	} catch (err) {
		console.error(`Giphy API error: ${err}`);
		return null;
	}
}
