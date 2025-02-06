PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_budgets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category` text NOT NULL,
	`amount` real NOT NULL,
	`period` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`is_recurring` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_budgets`("id", "category", "amount", "period", "start_date", "end_date", "is_recurring") SELECT "id", "category", "amount", "period", "start_date", "end_date", "is_recurring" FROM `budgets`;--> statement-breakpoint
DROP TABLE `budgets`;--> statement-breakpoint
ALTER TABLE `__new_budgets` RENAME TO `budgets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;