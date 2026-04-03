#!/usr/bin/env node
/**
 * Reformat unit/lesson JSON so each challenge `options` entry is one line:
 *   { "text": "...", "isCorrect": true }
 *
 * Usage:
 *   node scripts/format-lesson-options-one-line.mjs <path-to.json>
 *   node scripts/format-lesson-options-one-line.mjs prd/goose-lesson-1.json
 *
 * Writes the file in place. Run from repo root.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const fileArg = process.argv[2];
if (!fileArg) {
	console.error("Usage: node scripts/format-lesson-options-one-line.mjs <path-to.json>");
	process.exit(1);
}

const abs = resolve(process.cwd(), fileArg);

function isOptionShape(o) {
	return (
		o !== null &&
		typeof o === "object" &&
		!Array.isArray(o) &&
		Object.keys(o).length === 2 &&
		"text" in o &&
		"isCorrect" in o &&
		typeof o.text === "string" &&
		typeof o.isCorrect === "boolean"
	);
}

function isCompactOptionsArray(arr) {
	return Array.isArray(arr) && arr.length > 0 && arr.every(isOptionShape);
}

/**
 * @param {unknown} value
 * @param {number} indent
 * @param {string | null} key — parent object key when stringifying a property value
 */
function stringify(value, indent, key) {
	const pad = "  ".repeat(indent);

	if (value === null) return "null";
	const t = typeof value;
	if (t === "string") return JSON.stringify(value);
	if (t === "number" || t === "boolean") return JSON.stringify(value);

	if (Array.isArray(value)) {
		if (key === "options" && isCompactOptionsArray(value)) {
			const inner = "  ".repeat(indent + 1);
			const lines = value.map(
				(o) => `${inner}{ "text": ${JSON.stringify(o.text)}, "isCorrect": ${o.isCorrect} }`
			);
			return `[\n${lines.join(",\n")}\n${pad}]`;
		}
		if (value.length === 0) return "[]";
		const items = value.map((item) => `${pad}  ${stringify(item, indent + 1, null)}`).join(",\n");
		return `[\n${items}\n${pad}]`;
	}

	if (typeof value === "object") {
		const entries = Object.entries(value).map(
			([k, v]) => `${pad}  ${JSON.stringify(k)}: ${stringify(v, indent + 1, k)}`
		);
		return `{\n${entries.join(",\n")}\n${pad}}`;
	}

	return JSON.stringify(value);
}

const raw = readFileSync(abs, "utf8");
let data;
try {
	data = JSON.parse(raw);
} catch (e) {
	console.error("Invalid JSON:", e.message);
	process.exit(1);
}

const out = `${stringify(data, 0, null)}\n`;
writeFileSync(abs, out, "utf8");
console.log("Wrote", abs);
