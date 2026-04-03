#!/usr/bin/env node
/**
 * Read a lesson JSON (same shape as prd/one-lesson-example.json) and POST it to the import API,
 * appending the lesson to an existing unit.
 *
 * Usage:
 *   node scripts/import-lesson.mjs <path-to-lesson.json> --unitId=<id>
 *   IMPORT_API_BASE=http://localhost:5173 node scripts/import-lesson.mjs prd/one-lesson-example.json --unitId=3
 *
 * Alternatively pass the unit id via env var:
 *   IMPORT_UNIT_ID=3 node scripts/import-lesson.mjs prd/one-lesson-example.json
 */

/**
 * # 基本用法
node scripts/import-lesson.mjs prd/one-lesson-example.json --unitId=3

# 通过环境变量传 unitId
IMPORT_UNIT_ID=3 node scripts/import-lesson.mjs prd/one-lesson-example.json

# 指定不同的 API 地址
IMPORT_API_BASE=https://xxx.workers.dev node scripts/import-lesson.mjs prd/one-lesson-example.json --unitId=3
 * 
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const base = (process.env.IMPORT_API_BASE ?? "http://localhost:5173").replace(/\/$/, "");

// -- parse args --
const args = process.argv.slice(2);
const fileArg = args.find((a) => !a.startsWith("--"));
const unitIdFlag = args.find((a) => a.startsWith("--unitId="))?.split("=")[1];
const unitId = unitIdFlag ?? process.env.IMPORT_UNIT_ID;

if (!fileArg) {
	console.error("Usage: node scripts/import-lesson.mjs <path-to-lesson.json> --unitId=<id>");
	process.exit(1);
}

if (!unitId) {
	console.error("Error: unitId is required. Pass --unitId=<id> or set IMPORT_UNIT_ID env var.");
	process.exit(1);
}

const numericUnitId = Number(unitId);
if (!Number.isFinite(numericUnitId) || numericUnitId <= 0) {
	console.error("Error: unitId must be a positive integer.");
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

const url = `${base}/api/admin/units/${numericUnitId}/lessons/import`;

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
