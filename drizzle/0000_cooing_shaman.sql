CREATE TABLE `skillify_edge_dev_1_attachments` (
	`id` char(24) NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
	`course_id` char(24) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_edge_dev_1_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `skillify_edge_dev_1_attachments_course_id_unique` UNIQUE(`course_id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_edge_dev_1_categories` (
	`id` char(24) NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `skillify_edge_dev_1_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `skillify_edge_dev_1_categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `skillify_edge_dev_1_chapters` (
	`id` char(24) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`video_url` varchar(255),
	`position` int NOT NULL,
	`is_published` boolean NOT NULL DEFAULT false,
	`is_free` boolean DEFAULT false,
	`course_id` char(24) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_edge_dev_1_chapters_id` PRIMARY KEY(`id`),
	CONSTRAINT `skillify_edge_dev_1_chapters_course_id_unique` UNIQUE(`course_id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_edge_dev_1_courses` (
	`id` char(24) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`image_url` varchar(255),
	`price` float,
	`is_published` boolean DEFAULT false,
	`category_id` char(24) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_edge_dev_1_courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `skillify_edge_dev_1_courses_category_id_unique` UNIQUE(`category_id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_edge_dev_1_mux_data` (
	`id` char(24) NOT NULL,
	`asset_id` varchar(255) NOT NULL,
	`playback_id` varchar(255),
	`chapter_id` char(24) NOT NULL,
	CONSTRAINT `skillify_edge_dev_1_mux_data_id` PRIMARY KEY(`id`),
	CONSTRAINT `skillify_edge_dev_1_mux_data_chapter_id_unique` UNIQUE(`chapter_id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_edge_dev_1_purchases` (
	`user_id` varchar(255) NOT NULL,
	`course_id` char(24) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_edge_dev_1_purchases_user_id_course_id_pk` PRIMARY KEY(`user_id`,`course_id`),
	CONSTRAINT `skillify_edge_dev_1_purchases_course_id_unique` UNIQUE(`course_id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_edge_dev_1_stripe_customers` (
	`id` char(24) NOT NULL,
	`user_id` varchar(255),
	`stripe_customer_id` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT now(),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_edge_dev_1_stripe_customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `skillify_edge_dev_1_stripe_customers_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `skillify_edge_dev_1_stripe_customers_stripe_customer_id_unique` UNIQUE(`stripe_customer_id`)
);
--> statement-breakpoint
CREATE TABLE `skillify_edge_dev_1_user_progress` (
	`user_id` varchar(255) NOT NULL,
	`chapter_id` char(24) NOT NULL,
	`is_completed` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skillify_edge_dev_1_user_progress_user_id_chapter_id_pk` PRIMARY KEY(`user_id`,`chapter_id`),
	CONSTRAINT `skillify_edge_dev_1_user_progress_chapter_id_unique` UNIQUE(`chapter_id`)
);
--> statement-breakpoint
CREATE INDEX `course_id_idx` ON `skillify_edge_dev_1_attachments` (`course_id`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `skillify_edge_dev_1_categories` (`name`);--> statement-breakpoint
CREATE INDEX `course_id_idx` ON `skillify_edge_dev_1_chapters` (`course_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `skillify_edge_dev_1_courses` (`user_id`);--> statement-breakpoint
CREATE INDEX `category_id_idx` ON `skillify_edge_dev_1_courses` (`category_id`);--> statement-breakpoint
CREATE INDEX `chapter_id_idx` ON `skillify_edge_dev_1_mux_data` (`chapter_id`);--> statement-breakpoint
CREATE INDEX `user_id_course_id_idx` ON `skillify_edge_dev_1_purchases` (`user_id`,`course_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `skillify_edge_dev_1_stripe_customers` (`user_id`);--> statement-breakpoint
CREATE INDEX `stripe_customer_id_idx` ON `skillify_edge_dev_1_stripe_customers` (`stripe_customer_id`);--> statement-breakpoint
CREATE INDEX `user_id_chapter_id_idx` ON `skillify_edge_dev_1_user_progress` (`user_id`,`chapter_id`);