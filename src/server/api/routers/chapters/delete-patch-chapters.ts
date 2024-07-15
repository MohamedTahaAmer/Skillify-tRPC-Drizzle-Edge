import Mux from "@mux/mux-node"
import { TRPCError } from "@trpc/server"

import { env } from "@/env"
import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const { Video } = new Mux(env.MUX_TOKEN_ID, env.MUX_TOKEN_SECRET)
export async function deleteChapter({
	courseId,
	userId,
	chapterId,
	db,
}: {
	courseId: schema.CoursesSelect["id"]
	userId: schema.CoursesSelect["userId"]
	chapterId: schema.ChaptersSelect["id"]
	db: MySql2Database<typeof schema>
}) {
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(
				and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			)
	)[0]

	if (!ownCourse) throw new TRPCError({ code: "FORBIDDEN" })

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

	if (!chapter) throw new TRPCError({ code: "NOT_FOUND" })

	if (chapter.videoUrl) {
		let existingMuxData = (
			await db
				.selectDistinct()
				.from(schema.muxData)
				.where(eq(schema.muxData.chapterId, chapterId))
		)[0]

		if (existingMuxData) {
			await Video.Assets.del(existingMuxData.assetId)
			await db
				.delete(schema.muxData)
				.where(eq(schema.muxData.id, existingMuxData.id))
		}
	}

	let deletedChapter = await db
		.selectDistinct()
		.from(schema.chapters)
		.where(eq(schema.chapters.id, chapterId))
	await db.delete(schema.chapters).where(eq(schema.chapters.id, chapterId))

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

	revalidatePath("/")
	return deletedChapter
}

export let chapterValidator = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	videoUrl: z.string().optional(),
	isFree: z.boolean().optional(),
})
type chapterValidatorType = z.infer<typeof chapterValidator>
export async function patchChapter({
	courseId,
	chapterId,
	userId,
	chapterNewValues,
	db,
}: {
	courseId: schema.CoursesSelect["id"]
	chapterId: schema.ChaptersSelect["id"]
	userId: schema.CoursesSelect["userId"]
	chapterNewValues: chapterValidatorType
	db: MySql2Database<typeof schema>
}) {
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(
				and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			)
	)[0]
	if (!ownCourse) throw new TRPCError({ code: "FORBIDDEN" })

	await db
		.update(schema.chapters)
		.set(chapterNewValues)
		.where(
			and(
				eq(schema.chapters.id, chapterId),
				eq(schema.chapters.courseId, courseId),
			),
		)

	if (chapterNewValues.videoUrl) {
		let existingMuxData = (
			await db
				.selectDistinct()
				.from(schema.muxData)
				.where(eq(schema.muxData.chapterId, chapterId))
		)[0]

		if (existingMuxData) {
			try {
				await Video.Assets.del(existingMuxData.assetId)
			} catch (error) {
				console.error("Error deleting MUX asset", error)
			}
			await db
				.delete(schema.muxData)
				.where(eq(schema.muxData.id, existingMuxData.id))
		}

		const asset = await Video.Assets.create({
			input: chapterNewValues.videoUrl,
			playback_policy: "public",
			test: false,
		})

		await db.insert(schema.muxData).values({
			chapterId: chapterId,
			assetId: asset.id,
			playbackId: asset.playback_ids?.[0]?.id,
		})
	}
}
