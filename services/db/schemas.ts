import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	name: text("name").notNull(),
	type: text("type").notNull(),
	balance: real("balance").notNull().default(0),
	accountNumber: text("account_number"),
	currency: text("currency").notNull().default("USD"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const transactions = sqliteTable("transactions", {
	id: text("id").primaryKey(),
	accountId: text("account_id")
		.notNull()
		.references(() => accounts.id),
	type: text("type").notNull(), // 'income' or 'expense'
	amount: real("amount").notNull(),
	category: text("category"),
	description: text("description"),
	date: integer("date", { mode: "timestamp" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const budgets = sqliteTable("budgets", {
	id: text("id").primaryKey(),
	category: text("category").notNull(),
	amount: real("amount").notNull(),
	period: text("period").notNull(), // 'weekly', 'monthly', 'yearly'
	startDate: integer("start_date", { mode: "timestamp" }).notNull(),
	endDate: integer("end_date", { mode: "timestamp" }),
	isRecurring: integer("is_recurring", { mode: "boolean" })
		.notNull()
		.default(false),
});

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	currency: text("currency").notNull().default("USD"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});
