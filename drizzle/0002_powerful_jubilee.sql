ALTER TABLE `accounts` ADD `user_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `accounts` ADD `account_number` text;