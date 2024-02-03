ALTER TABLE `skillify_dev_1_attachments` MODIFY COLUMN `course_id` char(24) NOT NULL;--> statement-breakpoint
ALTER TABLE `skillify_dev_1_chapters` MODIFY COLUMN `course_id` char(24) NOT NULL;--> statement-breakpoint
ALTER TABLE `skillify_dev_1_courses` MODIFY COLUMN `category_id` char(24);--> statement-breakpoint
ALTER TABLE `skillify_dev_1_mux_data` MODIFY COLUMN `chapter_id` char(24) NOT NULL;--> statement-breakpoint
ALTER TABLE `skillify_dev_1_purchases` MODIFY COLUMN `course_id` char(24) NOT NULL;--> statement-breakpoint
ALTER TABLE `skillify_dev_1_user_progress` MODIFY COLUMN `chapter_id` char(24) NOT NULL;