import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import initSqlJs from "sql.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const conf = JSON.parse(readFileSync(join(__dirname, "conf.json"), "utf8"));

const SCHEMA_VERSION = 2;

let db;
let dbPath;

export async function connect() {
	dbPath = join(conf.db.path, conf.db.name);
	const SQL = await initSqlJs();
	if (existsSync(dbPath)) {
		const buf = readFileSync(dbPath);
		db = new SQL.Database(buf);
	} else {
		db = new SQL.Database();
	}
}

function save() {
	const data = db.export();
	writeFileSync(dbPath, Buffer.from(data));
}

function getSchemaVer() {
	const res = db.exec("PRAGMA user_version");
	if (!res.length) return 0;
	return res[0].values[0][0];
}

function setSchemaVer(ver) {
	db.run(`PRAGMA user_version = ${ver}`);
}

function upgradeSchema(from) {
	switch (from + 1) {
		case 1:
			db.run(`
CREATE TABLE messages(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user TEXT NOT NULL, userID TEXT NOT NULL,
	channelID TEXT NOT NULL, message TEXT NOT NULL,
	evt TEXT NOT NULL,
	ts DATETIME DEFAULT CURRENT_TIMESTAMP
)
			`);
			setSchemaVer(1);
			break;
		case 2:
			db.run(`
CREATE TABLE suggest_enabled(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	enabled INTEGER NOT NULL, message_id INTEGER NOT NULL,
	FOREIGN KEY(message_id) REFERENCES messages(id)
)
			`);
			setSchemaVer(2);
			break;
	}
}

export function updateSchema() {
	let ver = getSchemaVer();
	while (ver < SCHEMA_VERSION) {
		console.log("upgrading db schema ver: " + ver + " -> " + (ver + 1));
		upgradeSchema(ver);
		ver++;
	}
	save();
}

export function logMessage(msg) {
	db.run(
		"INSERT INTO messages (user, userID, channelID, message, evt) VALUES (?, ?, ?, ?, ?)",
		[msg.author.username, msg.author.id, msg.channel.id, msg.content, "message"]
	);
	console.log("log - (" + msg.author.username + ") " + msg.content);
	save();
	const res = db.exec("SELECT last_insert_rowid()");
	return res[0].values[0][0];
}

export function getSuggestEnabled(channelID) {
	const res = db.exec(
		"SELECT enabled FROM suggest_enabled AS se LEFT JOIN messages AS m ON m.id = se.message_id WHERE m.channelID = ? ORDER BY m.ts DESC LIMIT 1",
		[channelID]
	);
	if (!res.length || !res[0].values.length) return false;
	return res[0].values[0][0] === 1;
}

export function setSuggestEnabled(msg, bool) {
	const msgId = logMessage(msg);
	const boolval = bool ? 1 : 0;
	db.run(
		"INSERT INTO suggest_enabled (enabled, message_id) VALUES (?, ?)",
		[boolval, msgId]
	);
	save();
}
