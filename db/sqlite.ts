import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import { CREATE_TABLE_SQL } from "./schema";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  createdAt: string;     // ISO string
  deletedAt: string | null;
};

let _db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (Platform.OS === "web") {
    throw new Error("SQLite is not supported on web. Please use Android/iOS.");
  }
  if (!_db) {
    _db = SQLite.openDatabaseSync("expense.db");
  }
  return _db;
}

export async function initDb() {
  if (Platform.OS === "web") {
    console.warn("SQLite not supported on web platform");
    return;
  }
  const db = getDb();
  // tối ưu ghi & bật schema
  try {
    await db.execAsync("PRAGMA journal_mode = WAL;");
  } catch (e) {
    console.warn("WAL mode not supported:", e);
  }
  await db.execAsync(CREATE_TABLE_SQL);
}

export async function insertExpense(e: Expense) {
  const db = getDb();
  const sql = `INSERT INTO expenses (id,title,amount,type,createdAt,deletedAt)
               VALUES (?,?,?,?,?,NULL);`;
  await db.runAsync(sql, [e.id, e.title, e.amount, e.type, e.createdAt]);
}

export async function getExpense(id: string) {
  const db = getDb();
  return db.getFirstAsync<Expense>("SELECT * FROM expenses WHERE id=?", [id]);
}

export async function listExpenses(q = "") {
  const db = getDb();
  const clauses: string[] = ["deletedAt IS NULL"];
  const args: any[] = [];
  if (q.trim()) {
    clauses.push("(title LIKE ? OR CAST(amount AS TEXT) LIKE ?)");
    args.push(`%${q}%`, `%${q}%`);
  }
  const where = `WHERE ${clauses.join(" AND ")}`;
  const sql = `SELECT * FROM expenses ${where} ORDER BY datetime(createdAt) DESC;`;
  return db.getAllAsync<Expense>(sql, args);
}
