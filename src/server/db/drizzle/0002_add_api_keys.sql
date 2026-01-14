CREATE TABLE `recipe-buddy_api_key` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`key` text(255) NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`lastUsedAt` integer,
	FOREIGN KEY (`userId`) REFERENCES `recipe-buddy_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipe-buddy_api_key_key_unique` ON `recipe-buddy_api_key` (`key`);--> statement-breakpoint
CREATE INDEX `api_key_idx` ON `recipe-buddy_api_key` (`key`);--> statement-breakpoint
CREATE INDEX `api_key_user_id_idx` ON `recipe-buddy_api_key` (`userId`);
