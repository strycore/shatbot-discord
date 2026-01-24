import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Database from "better-sqlite3";

const __dirname = dirname(fileURLToPath(import.meta.url));
const conf = JSON.parse(readFileSync(join(__dirname, "conf.json"), "utf8"));

const SCHEMA_VERSION = 2;

let db;

export function connect() {
	const dburi = join(conf.db.path, conf.db.name);
	db = new Database(dburi);
	db.pragma("journal_mode = WAL");
}

function getSchemaVer() {
	const row = db.pragma("user_version", { simple: true });
	return row;
}

function setSchemaVer(ver) {
	db.pragma(`user_version = ${ver}`);
}

function upgradeSchema(from) {
	switch (from + 1) {
		case 1:
			db.exec(`
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
			db.exec(`
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
}

export function logMessage(msg) {
	const stmt = db.prepare(
		"INSERT INTO messages (user, userID, channelID, message, evt) VALUES (?, ?, ?, ?, ?)"
	);
	const info = stmt.run(
		msg.author.username,
		msg.author.id,
		msg.channel.id,
		msg.content,
		"message"
	);
	console.log("log - (" + msg.author.username + ") " + msg.content);
	return info.lastInsertRowid;
}

export function getSuggestEnabled(channelID) {
	const stmt = db.prepare(`
SELECT enabled FROM suggest_enabled AS se
LEFT JOIN messages AS m ON m.id = se.message_id
WHERE m.channelID = ?
ORDER BY m.ts DESC
LIMIT 1
	`);
	const row = stmt.get(channelID);
	if (!row) return false;
	return row.enabled === 1;
}

export function setSuggestEnabled(msg, bool) {
	const msgId = logMessage(msg);
	const boolstr = bool ? 1 : 0;
	const stmt = db.prepare(
		"INSERT INTO suggest_enabled (enabled, message_id) VALUES (?, ?)"
	);
	stmt.run(boolstr, msgId);
}
