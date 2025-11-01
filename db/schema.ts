export const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT CHECK(type IN ('income','expense')) NOT NULL,
  createdAt TEXT NOT NULL,
  deletedAt TEXT
);
CREATE INDEX IF NOT EXISTS idx_expenses_createdAt ON expenses(createdAt);
CREATE INDEX IF NOT EXISTS idx_expenses_deletedAt ON expenses(deletedAt);
CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(type);
`;