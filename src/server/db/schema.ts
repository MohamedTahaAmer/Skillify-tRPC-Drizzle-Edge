import { relations, sql } from "drizzle-orm"
import {
	boolean,
	float,
	index,
	int,
	mysqlTableCreator,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core"
import { dbName } from "drizzle.config"
export const mysqlTable = mysqlTableCreator((name) => `${dbName}${name}`)
export const courses = mysqlTable(
	"courses",
	{
		id: int("id").primaryKey().autoincrement(),
		userId: varchar("user_id", { length: 255 }).notNull(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		imageUrl: varchar("image_url", { length: 255 }),
		price: float("price"),
		isPublished: boolean("is_published").default(false),
		categoryId: int("category_id"),
		createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
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
		id: int("id").primaryKey().autoincrement(),
		name: varchar("name", { length: 255 }).unique(),
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
		id: int("id").primaryKey().autoincrement(),
		name: varchar("name", { length: 255 }).notNull(),
		url: varchar("url", { length: 255 }).notNull(),
		courseId: int("course_id").notNull(),
		createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
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
		id: int("id").primaryKey().autoincrement(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		videoUrl: varchar("video_url", { length: 255 }),
		position: int("position").notNull(),
		isPublished: boolean("is_published").default(false),
		isFree: boolean("is_free").default(false),
		courseId: int("course_id").notNull(),
		createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
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
		id: int("id").primaryKey().autoincrement(),
		assetId: varchar("asset_id", { length: 255 }).notNull(),
		playbackId: varchar("playback_id", { length: 255 }),
		chapterId: varchar("chapter_id", { length: 255 }).notNull(),
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
		chapterId: int("chapter_id").notNull(),
		isCompleted: boolean("is_completed").default(false),
		createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
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
		courseId: int("course_id").notNull(),
		createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
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
		id: int("id").primaryKey().autoincrement(),
		userId: varchar("user_id", { length: 255 }).unique(),
		stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
		createdAt: timestamp("created_at").default(sql`now()`),
		updatedAt: timestamp("updated_at").onUpdateNow(),
	},
	(example) => ({
		userIdIdx: index("user_id_idx").on(example.userId),
		stripeCustomerIdIdx: index("stripe_customer_id_idx").on(
			example.stripeCustomerId,
		),
	}),
)
