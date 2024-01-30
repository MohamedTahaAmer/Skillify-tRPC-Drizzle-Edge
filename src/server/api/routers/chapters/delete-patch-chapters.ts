import Mux from "@mux/mux-node"
import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { TRPCError } from "@trpc/server"

import { env } from "@/env"
import { z } from "zod"

const { Video } = new Mux(env.MUX_TOKEN_ID, env.MUX_TOKEN_SECRET)
export async function deleteChapter({
	courseId,
	userId,
	chapterId,
	db,
}: {
	courseId: string
	userId: string
	chapterId: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const ownCourse = await db.course.findUnique({
		where: {
			id: courseId,
			userId,
		},
	})

	if (!ownCourse) throw new TRPCError({ code: "FORBIDDEN" })

	const chapter = await db.chapter.findUnique({
		where: {
			id: chapterId,
			courseId: courseId,
		},
	})

	if (!chapter) throw new TRPCError({ code: "NOT_FOUND" })

	if (chapter.videoUrl) {
		const existingMuxData = await db.muxData.findFirst({
			where: {
				chapterId: chapterId,
			},
		})

		if (existingMuxData) {
			// >(11-1-2024:3)
			await Video.Assets.del(existingMuxData.assetId)
			await db.muxData.delete({
				where: {
					id: existingMuxData.id,
				},
			})
		}
	}

	const deletedChapter = await db.chapter.delete({
		where: {
			id: chapterId,
		},
	})

	const publishedChaptersInCourse = await db.chapter.findMany({
		where: {
			courseId: courseId,
			isPublished: true,
		},
	})

	if (!publishedChaptersInCourse.length) {
		await db.course.update({
			where: {
				id: courseId,
			},
			data: {
				isPublished: false,
			},
		})
	}

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
	courseId: string
	chapterId: string
	userId: string
	chapterNewValues: chapterValidatorType
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const ownCourse = await db.course.findUnique({
		where: {
			id: courseId,
			userId,
		},
	})

	if (!ownCourse) throw new TRPCError({ code: "FORBIDDEN" })

	const chapter = await db.chapter.update({
		where: {
			id: chapterId,
			courseId: courseId,
		},
		data: {
			...chapterNewValues,
		},
	})

	if (chapterNewValues.videoUrl) {
		const existingMuxData = await db.muxData.findFirst({
			where: {
				chapterId: chapterId,
			},
		})

		if (existingMuxData) {
			await Video.Assets.del(existingMuxData.assetId)
			await db.muxData.delete({
				where: {
					id: existingMuxData.id,
				},
			})
		}

		// >(11-1-2024:3)
		const asset = await Video.Assets.create({
			input: chapterNewValues.videoUrl,
			playback_policy: "public",
			test: false,
		})

		await db.muxData.create({
			data: {
				chapterId: chapterId,
				// >(11-1-2024:3)
				// - assetId is id of your video on MUX platform, we use it incase we need to delete the video
				assetId: asset.id,
				// - the playbackId is the id of the video on MUX platform, we use it to play the video using the MUXPlayer component
				playbackId: asset.playback_ids?.[0]?.id,
			},
		})
	}

	return chapter
}
