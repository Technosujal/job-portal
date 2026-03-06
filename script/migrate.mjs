// Migration script — adds new columns and tables to the existing SQLite DB
import { createClient } from "@libsql/client";

const client = createClient({ url: "file:sqlite.db" });

async function migrate() {
  console.log("Running migration...");

  const migrations = [
    // Users table — add isPublic column
    `ALTER TABLE users ADD COLUMN is_public INTEGER DEFAULT 1`,

    // Jobs table — add view_count
    `ALTER TABLE jobs ADD COLUMN view_count INTEGER DEFAULT 0`,

    // Applications table — add notes and interview_date
    `ALTER TABLE applications ADD COLUMN notes TEXT`,
    `ALTER TABLE applications ADD COLUMN interview_date INTEGER`,

    // Notifications table (new)
    `CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      type TEXT NOT NULL DEFAULT 'general',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      link TEXT
    )`,
  ];

  for (const sql of migrations) {
    try {
      await client.execute(sql);
      console.log("✓", sql.split("\n")[0].trim());
    } catch (err) {
      if (err.message && err.message.includes("duplicate column")) {
        console.log("⚠ Already exists (skipping):", sql.split("\n")[0].trim());
      } else {
        console.error("✗ Failed:", sql.split("\n")[0].trim(), "\n  Error:", err.message);
      }
    }
  }

  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch(err => { console.error(err); process.exit(1); });
