import { schema } from "@/server/db"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"

export async function unpublish({
	courseId,
	chapterId,
	userId,
	db,
}: {
	courseId: schema.CoursesSelect["id"]
	chapterId: schema.ChaptersSelect["id"]
	userId: schema.CoursesSelect["userId"]
	db: PlanetScaleDatabase<typeof schema>
}) {
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(
				and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			)
	)[0]
	if (!ownCourse)
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" })

	let unpublishedChapter = (
		await db
			.selectDistinct()
			.from(schema.chapters)
			.where(
				and(
					eq(schema.chapters.id, chapterId),
					eq(schema.chapters.courseId, courseId),
				),
			)
	)[0]

	await db
		.update(schema.chapters)
		.set({ isPublished: false })
		.where(
			and(
				eq(schema.chapters.id, chapterId),
				eq(schema.chapters.courseId, courseId),
			),
		)

	let publishedChaptersInCourse = await db
		.select()
		.from(schema.chapters)
		.where(
			and(
				eq(schema.chapters.courseId, courseId),
				eq(schema.chapters.isPublished, true),
			),
		)

	if (!publishedChaptersInCourse.length) {
		await db
			.update(schema.courses)
			.set({ isPublished: false })
			.where(eq(schema.courses.id, courseId))
	}

	return unpublishedChapter
}

export async function publish({
	courseId,
	chapterId,
	userId,
	db,
}: {
	courseId: schema.CoursesSelect["id"]
	chapterId: schema.ChaptersSelect["id"]
	userId: schema.CoursesSelect["userId"]
	db: PlanetScaleDatabase<typeof schema>
}) {
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(
				and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			)
	)[0]

	if (!ownCourse)
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" })

	let chapter = (
		await db
			.selectDistinct()
			.from(schema.chapters)
			.where(
				and(
					eq(schema.chapters.id, chapterId),
					eq(schema.chapters.courseId, courseId),
				),
			)
	)[0]

	let muxData = (
		await db
			.selectDistinct()
			.from(schema.muxData)
			.where(eq(schema.muxData.chapterId, chapterId))
	)[0]

	if (
		!muxData ||
		!chapter?.title ||
		!chapter.description ||
		!chapter.videoUrl
	) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Missing required fields",
		})
	}

	let publishedChapter = (
		await db
			.selectDistinct()
			.from(schema.chapters)
			.where(
				and(
					eq(schema.chapters.id, chapterId),
					eq(schema.chapters.courseId, courseId),
				),
			)
	)[0]

	await db
		.update(schema.chapters)
		.set({ isPublished: true })
		.where(
			and(
				eq(schema.chapters.id, chapterId),
				eq(schema.chapters.courseId, courseId),
			),
		)

	return publishedChapter
}
