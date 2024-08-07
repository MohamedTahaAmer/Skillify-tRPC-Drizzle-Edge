import { schema } from "@/server/db"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { ProtectedCTX } from "../../trpc"

export let unpublishCourseDTO = z.object({ courseId: z.string().min(1) })
type UnpublishCourseDTO = z.infer<typeof unpublishCourseDTO>
export async function unpublishCourse({ ctx, input }: { ctx: ProtectedCTX; input: UnpublishCourseDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { courseId } = input
	let course = (
		await db.query.courses.findMany({
			where: and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			limit: 1,
		})
	)[0]

	if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })

	await db
		.update(schema.courses)
		.set({
			isPublished: false,
		})
		.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))

	let unpublishedCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	)[0]

	revalidatePath("/")
	return unpublishedCourse
}

export let publishCourseDTO = z.object({ courseId: z.string().min(1) })
type PublishCourseDTO = z.infer<typeof publishCourseDTO>
export async function publishCourse({ ctx, input }: { ctx: ProtectedCTX; input: PublishCourseDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { courseId } = input
	let course = (
		await db.query.courses.findMany({
			where: and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			with: {
				chapters: {
					with: {
						muxData: true,
					},
				},
			},
			limit: 1,
		})
	)[0]

	if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })

	const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished)

	if (!course.title ?? !course.description ?? !course.imageUrl ?? !course.categoryId ?? !hasPublishedChapter) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Missing required fields",
		})
	}

	await db
		.update(schema.courses)
		.set({
			isPublished: true,
		})
		.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))

	let publishedCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	)[0]

	revalidatePath("/")
	return publishedCourse
}
