CREATE TABLE `skillify_dev_1_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
	`course_id` int NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_dev_1_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_dev_1_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	CONSTRAINT `skillify_dev_1_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `skillify_dev_1_categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `skillify_dev_1_chapters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`video_url` varchar(255),
	`position` int NOT NULL,
	`is_published` boolean DEFAULT false,
	`is_free` boolean DEFAULT false,
	`course_id` int NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_dev_1_chapters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_dev_1_courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`image_url` varchar(255),
	`price` float,
	`is_published` boolean DEFAULT false,
	`category_id` int,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_dev_1_courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_dev_1_mux_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`asset_id` varchar(255) NOT NULL,
	`playback_id` varchar(255),
	`chapter_id` varchar(255) NOT NULL,
	CONSTRAINT `skillify_dev_1_mux_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_dev_1_purchases` (
	`user_id` varchar(255) NOT NULL,
	`course_id` int NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_dev_1_purchases_user_id_course_id_pk` PRIMARY KEY(`user_id`,`course_id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_dev_1_stripe_customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255),
	`stripe_customer_id` varchar(255),
	`created_at` timestamp DEFAULT now(),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_dev_1_stripe_customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `skillify_dev_1_stripe_customers_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `skillify_dev_1_stripe_customers_stripe_customer_id_unique` UNIQUE(`stripe_customer_id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_dev_1_user_progress` (
	`user_id` varchar(255) NOT NULL,
	`chapter_id` int NOT NULL,
	`is_completed` boolean DEFAULT false,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_dev_1_user_progress_user_id_chapter_id_pk` PRIMARY KEY(`user_id`,`chapter_id`)
);
--> statement-breakpoint
CREATE INDEX `course_id_idx` ON `skillify_dev_1_attachments` (`course_id`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `skillify_dev_1_categories` (`name`);--> statement-breakpoint
CREATE INDEX `course_id_idx` ON `skillify_dev_1_chapters` (`course_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `skillify_dev_1_courses` (`user_id`);--> statement-breakpoint
CREATE INDEX `category_id_idx` ON `skillify_dev_1_courses` (`category_id`);--> statement-breakpoint
CREATE INDEX `chapter_id_idx` ON `skillify_dev_1_mux_data` (`chapter_id`);--> statement-breakpoint
CREATE INDEX `user_id_course_id_idx` ON `skillify_dev_1_purchases` (`user_id`,`course_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `skillify_dev_1_stripe_customers` (`user_id`);--> statement-breakpoint
CREATE INDEX `stripe_customer_id_idx` ON `skillify_dev_1_stripe_customers` (`stripe_customer_id`);--> statement-breakpoint
CREATE INDEX `user_id_chapter_id_idx` ON `skillify_dev_1_user_progress` (`user_id`,`chapter_id`);