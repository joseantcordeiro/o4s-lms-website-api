CREATE TABLE `faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`order` integer NOT NULL,
	`language` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`quote` text NOT NULL,
	`name` text NOT NULL,
	`avatar` text NOT NULL,
	`language` text NOT NULL,
	`order` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
