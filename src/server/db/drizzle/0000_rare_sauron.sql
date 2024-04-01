CREATE TABLE `recipe-buddy_ingredient` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`scrapedName` text NOT NULL,
	`recipeId` integer NOT NULL,
	FOREIGN KEY (`recipeId`) REFERENCES `recipe-buddy_recipe`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `recipe-buddy_recipe` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`url` text(512) NOT NULL,
	`steps` text,
	`imageUrl` text(256)
);
--> statement-breakpoint
CREATE TABLE `recipe-buddy_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`username` text(255) NOT NULL,
	`passwordHash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipe-buddy_user_username_unique` ON `recipe-buddy_user` (`username`);--> statement-breakpoint
CREATE INDEX `username_idx` ON `recipe-buddy_user` (`name`);