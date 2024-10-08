"use strict";

const { Client, MessageEmbed } = require('discord.js');
const cheerio = require("cheerio");
const request = require("request");
const logger = require("winston");

const conf = require("./conf.json");
const db = require("./db.js");
const lutris = require("./lutris.js");
const youtube = require("./youtube.js");
const giphy = require("./giphy.js");
const meme = require("./meme.js");
const aussie = require("./aussie.js");
const jfss = require("./jfss.js");
const pedro = require("./oof.js");
const great = require("./scott.js");

db.connect();
db.updateSchema();

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true,
});
logger.level = "debug";


function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
	  let j = Math.floor(Math.random() * (i + 1));
	  [array[i], array[j]] = [array[j], array[i]];
	}
}

const randomChoice = function(deck) {
	for (var i = 0; i < 200; i++) {
		shuffle(deck)
	}
	var index = Math.floor(Math.random() * deck.length);
	return deck[index];
}

const tickleMeFrojoe = function(msg, args) {
	var nums = args[0].split("d");
	if (nums.length == 2 && nums[0].length < 3 && nums[1].length < 5) {
		var totalroll = 0;
		var num = parseInt(nums[0]);
		var die = parseInt(nums[1]);
		if (num > 0 && die > 0 && num == nums[0] && die == nums[1]) {
			var rolls = [];
			var c = 0;
			for (var i = 0; i < num; i++) {
				c = Math.floor(Math.random() * die) + 1;
				totalroll += c;
				rolls.push(c);
			}
			return "<@" +
				msg.author.id +
				"> rolled a " +
				totalroll +
				" (" +
				rolls.join(" + ") +
				")";
		}
	}
	return "Usage: !frojoe XdY\nWhere: X and Y are members of ℕ*, X < 100, and Y < 10000";
}

const linuxgnuruGoingToBed = function () {
	const goingToBedQuotes = [
		"anywho; i'm going to bed; maybe i can get 2 hours of sleep",
		"ffs\ni'm going to bed.",
		"TIL\nalso i'm going to bed now as it's 2 minutes until midnight",
		"i think it's time i went to bed ...",
		"woah\nok, i'm not going to bed anytime soon",
		"right; well i haven't gone to bed yet and it's now 5:25am so laters",
		"Ok... 30 min of RotTR then to bed. Honestly",
		"And now I haz to go to bed because 1)I'm old and 2) I have to get up at 4:00am",
		"so; back to finishing watching LGC LDW\nand then bed",
		"damn it; and here i was hoping to go to bed early",
		"anyway; off to bed so i can sleep and maybe make it in 7 hours for LGC",
		"aww damn it; it's past my bed time now :frowning:",
		"i have been awake for 27 hours time to go to bed",
	];
	var quoteIndex = Math.floor(Math.random() * goingToBedQuotes.length);
	return goingToBedQuotes[quoteIndex];
}


const justinLaptop = function () {
	const wares = [
		"laptop",
		"MacBook",
		"workstation"
	]
	const vendors = [
		"Dell", "Lenovo", "Apple", "System76", "HP"
	]
	const sentences = [
		"Today, I bought a $PRICE VENDOR HARDWARE",
		"My $PRICE HARDWARE is dead!",
		"I ordered 3 $PRICE HARDWAREs",
		"Looking into getting the new $PRICE HARDWARE from VENDOR"
	]
	const laptopPrices = [
		"1,049",
		"1,790",
		"2,200",
		"2,990",
		"4,490",
	]
	const workstationPrices = [
		"3,000",
		"8,900",
		"12,900",
		"33,900",
	]
	var hardware = randomChoice(wares)
	var sentence = randomChoice(sentences)
	var prices = (hardware === "workstation") ? workstationPrices : laptopPrices
	var price = randomChoice(prices)
	var vendor = randomChoice(vendors)
	sentence = sentence.replace("HARDWARE", hardware)
	sentence = sentence.replace("VENDOR", vendor)
	return sentence.replace("PRICE", price)
}

const justinsBoss = function () {
	const bossIsDoingThings = [
		"is gambling in Las Vegas",
		"has a bedroom full of naked people",
		"is binge watching House of the Dragon",
		"is playing the Playstation 5 all day",
		"is drinking cocktails on a boat in the Caribbean",
		"is chilling on the beach with his girlfriend",
		"is eating caviar and drinking champagne",
		"is doing tons of cocaine and having freaky sex",
		"is taking photos of mountain goats in Glacier National Park",
	]
	const justinIsDoingThings = [
		"trains the new hire who is incompetent",
		"is asked to break basic security protocols",
		"is asked to do something that will get him fired",
		"has to deal with Autodesk support and their bullshit",
		"has to deal with Dell customer support",
		"has to respond to an engineer who is being an entitled prick",
		"reinstalls Adobe Acrobat Reader for the 10th time today",
		"is being reprimanded by a coworker for bringing water to the office",
		"has to fix a bad Windows 11 update",
	]
	return "Justin's boss " + randomChoice(bossIsDoingThings) + " while Justin " + randomChoice(justinIsDoingThings);
}

const newGuy = function () {
	const newGuyIsDoing = [
		"has a Latitude laptop, he is proud to be inferior!",
		"is shit at coding and pushed a bad update to prod, 8 million Windows machines have crashed",
		"used to stream Baldur's Gate 3 on Twitch, but now he serves the establishment",
		"has made a leak in the water cooling loop. What a bozo.",
		"doesn't know how to do a nmap scan. He has zero XP in networking.",
		"doesn't have a computer, he is using an iPad. He is totally skill-less",
		"deleted the production database. He's worse than useless.",
		"is being scolded by Justin's boss for fucking up big time once again",
		"uploaded adult videos to the company's Sharepoint. Probably what he did best so far",
		"wants dual 4090s TOMORROW MORNING. But he doesn't deserve them. He gets FUCK ALL.",
		"refuses to use anything other than Haiku OS. He will learn to do as he's told.",
		"wants to use his Steam Deck as his main work computer. He doesn't know what it means to get shit done.",
		"doesn't want to log in any server that uses Systemd. He read something about it on the Manjaro forums.",
		"helped me figure it out with chatgpt. The outcome was wrong and 2 people died because of that.",
	]
	return "The new guy " + randomChoice(newGuyIsDoing);
}

const jalaud = function () {
	const software = randomChoice([
		"Reaper",
		"qpwgraph",
		"HomeAssistant",
		"Emacs",
		"Jira",
		"Gitlab",
		"podman",
		"Jellyfin",
		"Firefox",
		"pipewire",
		"ufw",
		"KDE Plasma",
		"Gamescope",
		"Lutris",
		"Audacity",
		"Wayland",
	]);
	const action = randomChoice([
		"made a systemd service for",
		"upgraded",
		"deleted",
		"gave root access to",
		"checked the logs for",
		"transferred my old backups for",
	]);
	const hardware = randomChoice([
		"Ryzen CPU",
		"Radeon GPU",
		"12cm fan",
		"AMD RX 5700 XT",
		"1TB SSD",
		"USB sound interface",
		"Bluetooth headset",
		"mechanical keyboard",
		"Celeron 333",
		"Steam Deck",
		"MSI Claw",
	]);
	const effect = randomChoice([
		"smelling like burned hair",
		"frozen",
		"out of wack",
		"causing low frequency resonances",
		"spamming my systemd logs",
		"causing my phone to overheat",
		"making my computer shut down but only after 4PM",
		"making me nauseous",
		"infected with a trojan"
	])
	return "I " + action + " " + software + " and now my " + hardware + " is " + effect + "!";
}

const venn = function () {
	const action = randomChoice([
		"play fighting games",
		"use hard disk drives",
		"use micro SD cards",
		"use Gnome or KDE",
		"play point and click games",
	])
	const reason = randomChoice([
		"I'm not competitive enough to go to the EVO finals.",
		"I've had a Seagate crash in 2005",
		"they're too small and can get lost",
		"they get in my way",
		"there was a time and a place for that and it was called the nineties"
	])
	return "I don't " + action + " because " + reason + "."
}

const dmPunish = function (args) {
	const didrex = /(<@[0-9]*>)/;
	const argstr = args.join(' ').trim();
	//logger.info(`argstr: ${argstr}`);
	const m = argstr.match(didrex);
	//logger.info(`m: ${m}`);
	let needvictim = [
		"You must tell me whom I should tickle, master.",
		"My firey wrath need but a target, your greatness.",
		"Oh, I got 'em boss. You just gotta tell me who.",
		"If you gime me a name, I'll let them have it."
	];
	if(!m)
		return randomChoice(needvictim);

	var punishments = [
		"A rain of acid falls upon <@>, turning them in a puddle of bubbly flesh",
		"A goblin robs <@> of all their possessions",
		"<@> fall in a pit of lava and burns to death horribly",
		"An IT professional pushes you out of the way and installs Windows 11 on <@>'s computer",
		"<@> trampled by a herd of elephants",
		"<@> is forced to use SUSE Linux",
		"<@> ingested an extremely potent poison, their death is instant",
		"A mimic chomps <@> in half",
		"<@> fell in a spike trap, leaving them alive, but immobile, trapped to slowly bleed out",
		"<@> has been eaten by a grue",
		"Metal grids come out of the ceiling and walls, turning <@> into little cubes",
		"<@> is mauled by a bear and then it begins to eat you alive",
		"<@> becomes dinner for a mountain lion",
		"<@>'s whole Steam Library is replaced by Dwarf Fortress",
		"<@> is suspended from Twitter",
	];

	const vname = m[0];
	let p = randomChoice(punishments);
	let punishment = p.replace('<@>', vname);

	return punishment;
}

// Initialize Discord Bot
var bot = new Client()
bot.login(conf["discord"]["auth_token"])

bot.on("ready", () => {
	//this.setPresence({ game: { name: "with itself" } });
	logger.info("Connected");
	logger.info("Logged in as: ");
	logger.info(bot.user.id + " - (" + bot.user.username + ")");
});

bot.on("any", event => {
	if (event.op == 0) return;
	// console.log(Date() + " - event: " + JSON.stringify(event));
});

bot.on("message", async (msg) => {
	const channelID = msg.channel.id
	const userID = msg

	if (msg.content.substring(0, 1) == "!") {
		var args = msg.content.substring(1).split(" ");
		var cmd = args[0];
		// logger.info(`cmd: ${cmd}`);
		args = args.splice(1);
		// logger.info(`args: ${args}`);
		const oofrex = /^[oO]+f$/;
		if(cmd.match(oofrex))
			cmd = "oof";
		switch (cmd) {
			case "scott":
				msg.channel.send(great.scott(args));
				break;
			case "turbobrad":
			case "strider":
				var victim = conf["victims"][cmd];
				msg.channel.send(makeInsult(victim));
				break;
			case "member":
				msg.channel.send(member());
				break;
			case "wat":
				msg.channel.send(watIs(args));
				break;
			case "mfoxdogg":
				msg.channel.send(foxxxify(args));
				break;
			case "mark":
				msg.channel.send(mark());
				break;
			case "lutris":
				let lutrisText = "wat"
				if (args.length > 0) {
					lutrisText = lutris.searchLutris(args);
				}
				msg.channel.send(lutrisText);
				break;
			case "frojoe":
				msg.channel.send(tickleMeFrojoe(msg, args))
				break;
			case "linuxgnuru":
				msg.channel.send(linuxgnuruGoingToBed());
				break;
			case "justin":
				msg.channel.send(justinLaptop());
				break;
			case "justinsboss":
				msg.channel.send(justinsBoss());
				break;
			case "newguy":
				msg.channel.send(newGuy());
				break;
			case "oof":
				msg.channel.send(pedro.oof());
				break;
			case "jalaud":
				msg.channel.send(jalaud());
				break;
			case "venn":
				msg.channel.send(venn());
				break;
			case "punish":
				msg.channel.send(dmPunish(args));
				break;
			case "mir":
				const giph = await giphy.getRandomGif("waifu")
				msg.channel.send(giph);
				break;
			case "mirppc":
				msg.channel.send("MOAR CORES!");
				break;
			case "img":
				const whatIsImg = "IMG was founded in 1960 in Cleveland, Ohio by Mark McCormack, an American lawyer who spotted the potential for athletes to make large incomes from endorsement in the television age; he signed professional golfers Arnold Palmer, Gary Player and Jack Nicklaus as his first clients who collectively are known as The Big Three."
				msg.channel.send(whatIsImg);
				break;
			case "atomicass":
				const _meme = await meme.makeMeme(args)
				if (_meme) {
					msg.channel.send(_meme)
				}
				break;
			case "aussie":
				msg.channel.send(aussie.flipText(args));
				break;
			case "jfss":
				msg.channel.send(jfss.steph());
				break;
			case "barf":
				var gifurls = [
					"https://media1.giphy.com/media/EiCQzmzE5HLaw/giphy.gif",
					"https://media1.giphy.com/media/3o7bugZgrGQEmE4epq/giphy.gif",
					"https://media1.giphy.com/media/zm9Tt8vsAmJmE/giphy.gif",
					"https://media3.giphy.com/media/xZv1drArGozD2/giphy.gif",
					"https://media0.giphy.com/media/iIj0itnYjTbQ4/giphy.gif",
					"https://media2.giphy.com/media/xT8qBbnDnrGWivuBlm/giphy.gif",
					"https://media0.giphy.com/media/3o7abLdw8eeqjX6m4g/giphy.gif",
					"https://media1.giphy.com/media/26FxCxnkrzUy0u2nm/giphy.gif",
					"https://media1.giphy.com/media/3o7aTmiKf3Lpp1ozXW/giphy.gif",
					"https://media3.giphy.com/media/9MmtzCIorgW7S/giphy.gif",
					"https://media1.giphy.com/media/26FxMl51JsgPnEzvy/giphy.gif",
					"https://media0.giphy.com/media/5gArNffWKNbXO/giphy.gif",
					"https://media2.giphy.com/media/e48mcLfU9zgFq/giphy.gif",
					"https://media1.giphy.com/media/xUA7b5sBrDikGvNs1G/giphy.gif",
					"https://media0.giphy.com/media/l44QkEErzRcmPuRlm/giphy.gif",
					"https://media1.giphy.com/media/WbhPKtfXZSM5a/giphy.gif",
					"https://media0.giphy.com/media/4qCEytljLybzq/giphy.gif",
				];
				var gn = Math.floor(Math.random() * gifurls.length);
				const barfEmbed = new MessageEmbed()
					.setImage(gifurls[gn])
					.setTitle("BARF!!!")
				msg.channel.send(barfEmbed);
				break;
			case "cage":
				var gifurls = [
					"https://media1.giphy.com/media/xTiTnC5cMmUx9bfWYU/giphy.gif",
					"https://media2.giphy.com/media/8J5qsXwnIah2M/giphy.gif",
					"https://media0.giphy.com/media/bQ40qrJdEg8Mw/giphy.gif",
					"https://media2.giphy.com/media/10uct1aSFT7QiY/giphy.gif",
					"https://media0.giphy.com/media/CiTLZWskt7Fu/giphy.gif",
				];
				var gn = Math.floor(Math.random() * gifurls.length);
				const cageEmbed = new MessageEmbed()
					.setImage(gifurls[gn])
					.setTitle("#CageForVenn")
				msg.channel.send(cageEmbed);
				break;
			default:
				if (conf["log"]["messages"]) db.logMessage(msg);
				break;
		}
	}

	function makeInsult(name) {
		var insults = require("./insults.json");
		var ins = insults.length;
		logger.info("ins: " + ins);
		var ind = Math.floor(Math.random() * ins);
		logger.info("ind: " + ind);
		var insult = insults[ind];
		var i = insult.replace(/@s/g, name);
		return i;
	}


	function member() {
		const memberBerries = require("./memberberries.json");
		return "…member " + randomChoice(memberBerries) + "?!!? :-D";
	}

	function watIs(args) {
		const wat = args.join(" ")
		if (!wat) {
			return "Yo, what's up?!";
		}
		const definitions = require("./definitions.json");
		const definition = definitions[wat.trim().toLowerCase()];
		if (definition) {
			return definition;
		} else {
			return "I have no clue what a " + args + " is.";
		}
	}

	function foxxxify(args) {
		const dogg = args[0]
		if (!dogg) return ":regional_indicator_m: :fox: :dog2: :flag_au:";
		const doggo = dogg.trim().toLowerCase();
		if (doggo === "out")
			return "https://cdn.discordapp.com/attachments/270406768750886912/443264760436490271/fuck-this-shit.png";
		if (doggo === "laterz")
			return "https://cdn.discordapp.com/attachments/270406768750886912/474401118915657746/Screenshot_from_2018-05-06_14-16-03.png";
		return "https://cdn.discordapp.com/attachments/270406768750886912/474401450257154048/Screenshot_from_2018-05-12_13-38-18.png";
	}

	function mark() {
		return "https://media.discordapp.net/attachments/270406768750886912/943523121074429952/Screenshot_from_2022-02-15_14-41-38.png"
	}
});
