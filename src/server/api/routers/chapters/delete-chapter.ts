import Mux from "@mux/mux-node"
import { TRPCError } from "@trpc/server"

import { env } from "@/env"
import { ProtectedCTX } from "@/server/api/trpc"
import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const { Video } = new Mux(env.MUX_TOKEN_ID, env.MUX_TOKEN_SECRET)

export let deleteChapterDTO = z.object({
	courseId: z.string().min(1),
	chapterId: z.string().min(1),
})

type DeleteChapterDTO = z.infer<typeof deleteChapterDTO>
export async function deleteChapter({ ctx, input }: { ctx: ProtectedCTX; input: DeleteChapterDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { courseId, chapterId } = input
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	)[0]

	if (!ownCourse) throw new TRPCError({ code: "FORBIDDEN" })

	let chapter = (
		await db
			.selectDistinct()
			.from(schema.chapters)
			.where(and(eq(schema.chapters.id, chapterId), eq(schema.chapters.courseId, courseId)))
	)[0]

	if (!chapter) throw new TRPCError({ code: "NOT_FOUND" })

	if (chapter.videoUrl) {
		let existingMuxData = (
			await db.selectDistinct().from(schema.muxData).where(eq(schema.muxData.chapterId, chapterId))
		)[0]

		if (existingMuxData) {
			await Video.Assets.del(existingMuxData.assetId)
			await db.delete(schema.muxData).where(eq(schema.muxData.id, existingMuxData.id))
		}
	}

	let deletedChapter = await db.selectDistinct().from(schema.chapters).where(eq(schema.chapters.id, chapterId))
	await db.delete(schema.chapters).where(eq(schema.chapters.id, chapterId))

	let publishedChaptersInCourse = await db
		.select()
		.from(schema.chapters)
		.where(and(eq(schema.chapters.courseId, courseId), eq(schema.chapters.isPublished, true)))

	if (!publishedChaptersInCourse.length) {
		await db.update(schema.courses).set({ isPublished: false }).where(eq(schema.courses.id, courseId))
	}

	revalidatePath("/")
	return deletedChapter
}
