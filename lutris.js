export async function searchLutris(args) {
	let qs, responseHandler;
	if (args[0] == "random") {
		let query = args[1];
		if (!query) {
			query = "1";
		}
		qs = "random=" + query;
		responseHandler = handleLutrisRandom;
	} else {
		qs = "search=" + args.join("+");
		responseHandler = handleLutrisSearch;
	}
	try {
		const response = await fetch("https://lutris.net/api/games?" + qs).then(r => r.json());
		return responseHandler(response);
	} catch (err) {
		console.log(`Lutris API error: ${err}`);
		return "Failed to reach Lutris API";
	}
}

function handleLutrisRandom(data) {
	const results = data.results;
	if (!results || !results.length) {
		return "No results found";
	}
	const game = results[0];
	let fields = [];
	if (game.year) {
		fields.push({
			name: "Year",
			value: String(game.year),
			inline: true
		});
	}
	if (game.platforms && game.platforms.length) {
		const platforms = game.platforms.map(p => p.name);
		fields.push({
			name: "Platforms",
			value: platforms.join(","),
			inline: true
		});
	}
	return {
		message: "",
		url: "https://lutris.net/games/" + game.slug,
		embed: {
			color: 0xf89a15,
			title: game.name,
			thumbnail: {
				url: "https://lutris.net/static/images/logo.png"
			},
			fields: fields,
			image: {
				url: "https://lutris.net" + game.banner_url
			}
		}
	};
}

function handleLutrisSearch(data) {
	const results = data.results;
	const loops = (results.length > 10) ? 10 : results.length;
	let msg = "";
	if (loops == 0) {
		msg = "Search returned 0 results";
	} else {
		msg = "First " + loops + " on Lutris:\n```";
		for (let i = 0; i < loops; i++) {
			const row = results[i];
			msg += (i + 1) + " - " + row.name + "\n";
		}
		msg += "```";
	}
	return msg;
}
