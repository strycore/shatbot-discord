import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { EmbedBuilder } from "discord.js";
import * as cheerio from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const conf = JSON.parse(readFileSync(join(__dirname, "conf.json"), "utf8"));
const api_url = "http://api.memegenerator.net";

export async function makeMeme(args) {
	const mconf = conf["memegenerator.net"];
	let text = args.join(" ").split("|");
	if (text.length == 1) {
		text[1] = text[0];
		text[0] = "";
	}
	const params = new URLSearchParams({
		username: mconf.username,
		password: mconf.password,
		apiKey: mconf.api_key,
		generatorID: mconf.generatorID,
		imageID: mconf.imageID,
		text0: text[0],
		text1: text[1]
	});
	try {
		const response = await fetch(api_url + "/Instance_Create?" + params, {
			method: "POST"
		}).then(r => r.json());
		if (!response.success) {
			console.log(response);
			return "*barf* :sick:";
		}
		const instanceUrl = response.result.instanceUrl;
		try {
			const html = await fetch(instanceUrl).then(r => r.text());
			const $ = cheerio.load(html);
			const jpgurl = $(".meme-image img").attr("src");
			return new EmbedBuilder().setImage(jpgurl);
		} catch (err) {
			console.log(`Failed to load ${instanceUrl}: ${err}`);
			return "agruhm, phruhm! :coke:";
		}
	} catch (err) {
		console.log(`Failed to create meme: ${err}`);
		return "*snort, snort* :coke:";
	}
}
