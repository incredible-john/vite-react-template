#!/usr/bin/env node
/**
 * Read a unit JSON (same shape as GET /api/admin/units/:id/export) and POST it to the import API.
 *
 * Usage:
 *   node scripts/import-unit.mjs <path-to.json>
 *   IMPORT_API_BASE=http://localhost:5173 node scripts/import-unit.mjs prd/unit-6-export.json
 *
 * Optional query override (subject must exist in DB):
 *   IMPORT_SUBJECT_ID=3 node scripts/import-unit.mjs prd/unit-6-export.json
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const fileArg = process.argv[2];
const base = (process.env.IMPORT_API_BASE ?? "http://localhost:5173").replace(/\/$/, "");
const subjectOverride = process.env.IMPORT_SUBJECT_ID;

if (!fileArg) {
	console.error("Usage: node scripts/import-unit.mjs <path-to-unit.json>");
	process.exit(1);
}

const abs = resolve(process.cwd(), fileArg);
let json;
try {
	json = JSON.parse(readFileSync(abs, "utf8"));
} catch (e) {
	console.error("Failed to read or parse JSON:", abs, e);
	process.exit(1);
}

const url =
	subjectOverride !== undefined && subjectOverride !== ""
		? `${base}/api/admin/units/import?subjectId=${encodeURIComponent(subjectOverride)}`
		: `${base}/api/admin/units/import`;

const res = await fetch(url, {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(json),
});

const text = await res.text();
let body;
try {
	body = JSON.parse(text);
} catch {
	body = text;
}

if (!res.ok) {
	console.error(res.status, body);
	process.exit(1);
}

console.log(res.status, body);
