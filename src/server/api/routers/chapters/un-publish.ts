import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { TRPCError } from "@trpc/server"

export async function unpublish({
	courseId,
	chapterId,
	userId,
	db,
}: {
	courseId: string
	chapterId: string
	userId: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const ownCourse = await db.course.findUnique({
		where: {
			id: courseId,
			userId,
		},
	})

	if (!ownCourse)
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" })

	const unpublishedChapter = await db.chapter.update({
		where: {
			id: chapterId,
			courseId: courseId,
		},
		data: {
			isPublished: false,
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

	return unpublishedChapter
}

export async function publish({
	courseId,
	chapterId,
	userId,
	db,
}: {
	courseId: string
	chapterId: string
	userId: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const ownCourse = await db.course.findUnique({
		where: {
			id: courseId,
			userId,
		},
	})

	if (!ownCourse)
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" })

	const chapter = await db.chapter.findUnique({
		where: {
			id: chapterId,
			courseId: courseId,
		},
	})

	const muxData = await db.muxData.findUnique({
		where: {
			chapterId: chapterId,
		},
	})

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

	const publishedChapter = await db.chapter.update({
		where: {
			id: chapterId,
			courseId: courseId,
		},
		data: {
			isPublished: true,
		},
	})

	return publishedChapter
}
