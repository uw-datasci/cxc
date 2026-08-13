#!/usr/bin/env node

/**
 * Database migration runner: loads env, then runs local `db-migrate` against
 * `migrations/` and `database.json` at the project root.
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const isProduction = process.env.NODE_ENV === "production";
const isCI = process.env.CI === "true";

if (!isProduction && !isCI) {
  const rootEnv = path.join(projectRoot, ".env");
  if (fs.existsSync(rootEnv)) {
    dotenv.config({ path: rootEnv });
    console.log("✓ Loaded environment from .env");
  } else {
    console.warn("⚠ Warning: No .env found; using process env only\n");
  }
} else {
  console.log(`✓ Running in ${isProduction ? "production" : "CI"} mode`);
}

if (!process.env.MIGRATE_DB_URL) {
  console.error("❌ ERROR: MIGRATE_DB_URL environment variable is not set");
  process.exit(1);
}

// db-migrate-pg drops all database.json options when ENV is used, so force SSL
// via the pg environment variable that the pg driver always respects.
// process.env.PGSSLMODE = process.env.PGSSLMODE ?? "";

const migrationsDir = path.join(projectRoot, "migrations");
const command = process.argv[2] || "up";
const args = process.argv.slice(3);

const dbMigrateBin = path.join(projectRoot, "node_modules", "db-migrate", "bin", "db-migrate");
const dbMigrateArgs = [dbMigrateBin, "-m", migrationsDir, command, ...args];
if (command === "create" && !args.includes("--sql-file")) dbMigrateArgs.push("--sql-file");

console.log(`\n🔄 Running database migration: ${command}\n`);

const child = spawn(process.execPath, dbMigrateArgs, {
  stdio: "inherit",
  env: process.env,
  cwd: projectRoot,
  shell: false,
});

child.on("close", (code) => {
  if (code === 0) {
    console.log("\n✅ Migration completed successfully\n");
  } else {
    console.error(`\n❌ Migration failed with exit code ${code}\n`);
    process.exit(code ?? 1);
  }
});

child.on("error", (err) => {
  console.error("❌ Failed to start migration process:", err);
  process.exit(1);
});
