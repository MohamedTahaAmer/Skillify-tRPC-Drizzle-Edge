import { ProtectedCTX } from "@/server/api/trpc"
import { schema } from "@/server/db"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export let unpublishChapterDTO = z.object({
	courseId: z.string().min(1),
	chapterId: z.string().min(1),
})

type UnpublishChapterDTO = z.infer<typeof unpublishChapterDTO>
export async function unpublishChapter({ ctx, input }: { ctx: ProtectedCTX; input: UnpublishChapterDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { chapterId, courseId } = input
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	)[0]
	if (!ownCourse) throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" })

	let unpublishedChapter = (
		await db
			.selectDistinct()
			.from(schema.chapters)
			.where(and(eq(schema.chapters.id, chapterId), eq(schema.chapters.courseId, courseId)))
	)[0]

	await db
		.update(schema.chapters)
		.set({ isPublished: false })
		.where(and(eq(schema.chapters.id, chapterId), eq(schema.chapters.courseId, courseId)))

	let publishedChaptersInCourse = await db
		.select()
		.from(schema.chapters)
		.where(and(eq(schema.chapters.courseId, courseId), eq(schema.chapters.isPublished, true)))

	if (!publishedChaptersInCourse.length) {
		await db.update(schema.courses).set({ isPublished: false }).where(eq(schema.courses.id, courseId))
	}

	revalidatePath("/")
	return unpublishedChapter
}

export let publishChapterDTO = z.object({
	courseId: z.string().min(1),
	chapterId: z.string().min(1),
})

type PublishChapterDTO = z.infer<typeof publishChapterDTO>
export async function publishChapter({ ctx, input }: { ctx: ProtectedCTX; input: PublishChapterDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { chapterId, courseId } = input
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	)[0]

	if (!ownCourse) throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" })

	let chapter = (
		await db
			.selectDistinct()
			.from(schema.chapters)
			.where(and(eq(schema.chapters.id, chapterId), eq(schema.chapters.courseId, courseId)))
	)[0]

	let muxData = (await db.selectDistinct().from(schema.muxData).where(eq(schema.muxData.chapterId, chapterId)))[0]

	if (!muxData || !chapter?.title || !chapter.description || !chapter.videoUrl) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Missing required fields",
		})
	}

	let publishedChapter = (
		await db
			.selectDistinct()
			.from(schema.chapters)
			.where(and(eq(schema.chapters.id, chapterId), eq(schema.chapters.courseId, courseId)))
	)[0]

	await db
		.update(schema.chapters)
		.set({ isPublished: true })
		.where(and(eq(schema.chapters.id, chapterId), eq(schema.chapters.courseId, courseId)))

	revalidatePath("/")
	return publishedChapter
}
