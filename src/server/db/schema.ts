import { relations, sql } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

import {
	boolean,
	char,
	float,
	index,
	int,
	mysqlTableCreator,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core"
import { env } from "@/env"

const mysqlTable = mysqlTableCreator((name) => `${env.DATABASE_PREFIX}${name}`)
export const courses = mysqlTable(
	"courses",
	{
		id: char("id", { length: 24 })
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: varchar("user_id", { length: 255 }).notNull(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		imageUrl: varchar("image_url", { length: 255 }),
		price: float("price"),
		isPublished: boolean("is_published").default(false),
		categoryId: char("category_id", { length: 24 }).unique().notNull(),
		createdAt: timestamp("created_at")
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(example) => ({
		userIdIdx: index("user_id_idx").on(example.userId),
		categoryIdIdx: index("category_id_idx").on(example.categoryId),
	}),
)
export const coursesRelations = relations(courses, ({ one, many }) => ({
	category: one(categories, {
		fields: [courses.categoryId],
		references: [categories.id],
	}),
	attachments: many(attachments),
	chapters: many(chapters),
	purchases: many(purchases),
}))
export const categories = mysqlTable(
	"categories",
	{
		id: char("id", { length: 24 })
			.primaryKey()
			.$defaultFn(() => createId()),
		name: varchar("name", { length: 255 }).unique().notNull(),
	},
	(example) => ({
		nameIdx: index("name_idx").on(example.name),
	}),
)
export const categoriesRelations = relations(categories, ({ many }) => ({
	courses: many(courses),
}))
export const attachments = mysqlTable(
	"attachments",
	{
		id: char("id", { length: 24 })
			.primaryKey()
			.$defaultFn(() => createId()),
		name: varchar("name", { length: 255 }).notNull(),
		url: varchar("url", { length: 255 }).notNull(),
		courseId: char("course_id", { length: 24 }).notNull().unique(),
		createdAt: timestamp("created_at")
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(example) => ({
		courseIdIdx: index("course_id_idx").on(example.courseId),
	}),
)
export const attachmentsRelations = relations(attachments, ({ one }) => ({
	course: one(courses, {
		fields: [attachments.courseId],
		references: [courses.id],
	}),
}))
export const chapters = mysqlTable(
	"chapters",
	{
		id: char("id", { length: 24 })
			.primaryKey()
			.$defaultFn(() => createId()),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		videoUrl: varchar("video_url", { length: 255 }),
		position: int("position").notNull(),
		isPublished: boolean("is_published").default(false).notNull(),
		isFree: boolean("is_free").default(false),
		courseId: char("course_id", { length: 24 }).notNull().unique(),
		createdAt: timestamp("created_at")
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(example) => ({
		courseIdIdx: index("course_id_idx").on(example.courseId),
	}),
)
export const chaptersRelations = relations(chapters, ({ one, many }) => ({
	course: one(courses, {
		fields: [chapters.courseId],
		references: [courses.id],
	}),
	muxData: one(muxData),
	userProgress: many(userProgress),
}))
export const muxData = mysqlTable(
	"mux_data",
	{
		id: char("id", { length: 24 })
			.primaryKey()
			.$defaultFn(() => createId()),
		assetId: varchar("asset_id", { length: 255 }).notNull(),
		playbackId: varchar("playback_id", { length: 255 }),
		chapterId: char("chapter_id", { length: 24 }).notNull().unique(),
	},
	(example) => ({
		chapterIdIdx: index("chapter_id_idx").on(example.chapterId),
	}),
)
export const muxDataRelations = relations(muxData, ({ one }) => ({
	chapter: one(chapters, {
		fields: [muxData.chapterId],
		references: [chapters.id],
	}),
}))
export const userProgress = mysqlTable(
	"user_progress",
	{
		userId: varchar("user_id", { length: 255 }).notNull(),
		chapterId: char("chapter_id", { length: 24 }).notNull().unique(),
		isCompleted: boolean("is_completed").default(false),
		createdAt: timestamp("created_at")
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(example) => ({
		userIdChapterIdIdx: index("user_id_chapter_id_idx").on(
			example.userId,
			example.chapterId,
		),
		pk: primaryKey({ columns: [example.userId, example.chapterId] }),
	}),
)
export const userProgressRelations = relations(userProgress, ({ one }) => ({
	chapter: one(chapters, {
		fields: [userProgress.chapterId],
		references: [chapters.id],
	}),
}))
export const purchases = mysqlTable(
	"purchases",
	{
		userId: varchar("user_id", { length: 255 }).notNull(),
		courseId: char("course_id", { length: 24 }).notNull().unique(),
		createdAt: timestamp("created_at")
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(example) => ({
		userIdCourseIdIdx: index("user_id_course_id_idx").on(
			example.userId,
			example.courseId,
		),
		pk: primaryKey({ columns: [example.userId, example.courseId] }),
	}),
)
export const purchasesRelations = relations(purchases, ({ one }) => ({
	course: one(courses, {
		fields: [purchases.courseId],
		references: [courses.id],
	}),
}))
export const stripeCustomers = mysqlTable(
	"stripe_customers",
	{
		id: char("id", { length: 24 })
			.primaryKey()
			.$defaultFn(() => createId()),
		userId: varchar("user_id", { length: 255 }).unique(),
		stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
		createdAt: timestamp("created_at")
			.default(sql`now()`)
			.notNull(),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(example) => ({
		userIdIdx: index("user_id_idx").on(example.userId),
		stripeCustomerIdIdx: index("stripe_customer_id_idx").on(
			example.stripeCustomerId,
		),
	}),
)

export type CoursesSelect = typeof courses.$inferSelect
export type CoursesInsert = typeof courses.$inferInsert

export type CategoriesSelect = typeof categories.$inferSelect
export type CategoriesInsert = typeof categories.$inferInsert

export type AttachmentsSelect = typeof attachments.$inferSelect
export type AttachmentsInsert = typeof attachments.$inferInsert

export type ChaptersSelect = typeof chapters.$inferSelect
export type ChaptersInsert = typeof chapters.$inferInsert

export type MuxDataSelect = typeof muxData.$inferSelect
export type MuxDataInsert = typeof muxData.$inferInsert

export type UserProgressSelect = typeof userProgress.$inferSelect
export type UserProgressInsert = typeof userProgress.$inferInsert

export type PurchasesSelect = typeof purchases.$inferSelect
export type PurchasesInsert = typeof purchases.$inferInsert

export type StripeCustomersSelect = typeof stripeCustomers.$inferSelect
export type StripeCustomersInsert = typeof stripeCustomers.$inferInsert
