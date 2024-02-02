import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"
import { TRPCError } from "@trpc/server"

export async function unpublish({
	courseId,
	userId,
	db,
}: {
	courseId: string
	userId: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const course = await db.course.findUnique({
		where: {
			id: courseId,
			userId,
		},
	})

	if (!course)
		throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })

	const unpublishedCourse = await db.course.update({
		where: {
			id: courseId,
			userId,
		},
		data: {
			isPublished: false,
		},
	})

	return unpublishedCourse
}

export async function publish({
	courseId,
	userId,
	db,
}: {
	courseId: string
	userId: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const course = await db.course.findUnique({
		where: {
			id: courseId,
			userId,
		},
		include: {
			chapters: {
				include: {
					muxData: true,
				},
			},
		},
	})

	if (!course)
		throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })

	const hasPublishedChapter = course.chapters.some(
		(chapter) => chapter.isPublished,
	)

	if (
		!course.title ??
		!course.description ??
		!course.imageUrl ??
		!course.categoryId ??
		!hasPublishedChapter
	) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Missing required fields",
		})
	}

	const publishedCourse = await db.course.update({
		where: {
			id: courseId,
			userId,
		},
		data: {
			isPublished: true,
		},
	})

	return publishedCourse
}
