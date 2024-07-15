import Mux from "@mux/mux-node"
import { TRPCError } from "@trpc/server"

import { env } from "@/env"
import { ProtectedCTX } from "@/server/api/trpc"
import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

const { Video } = new Mux(env.MUX_TOKEN_ID, env.MUX_TOKEN_SECRET)

export let chapterValidator = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	videoUrl: z.string().optional(),
	isFree: z.boolean().optional(),
})

export let patchChapterDTO = z.object({
	courseId: z.string().min(1),
	chapterId: z.string().min(1),
	chapterNewValues: chapterValidator,
})

type PatchChapterDTO = z.infer<typeof patchChapterDTO>
export async function patchChapter({ ctx, input }: { ctx: ProtectedCTX; input: PatchChapterDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { chapterId, chapterNewValues, courseId } = input
	let ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	)[0]
	if (!ownCourse) throw new TRPCError({ code: "FORBIDDEN" })

	await db
		.update(schema.chapters)
		.set(chapterNewValues)
		.where(and(eq(schema.chapters.id, chapterId), eq(schema.chapters.courseId, courseId)))

	if (chapterNewValues.videoUrl) {
		let existingMuxData = (
			await db.selectDistinct().from(schema.muxData).where(eq(schema.muxData.chapterId, chapterId))
		)[0]

		if (existingMuxData) {
			try {
				await Video.Assets.del(existingMuxData.assetId)
			} catch (error) {
				console.error("Error deleting MUX asset", error)
			}
			await db.delete(schema.muxData).where(eq(schema.muxData.id, existingMuxData.id))
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
