import { schema } from "@/server/db"
import Mux from "@mux/mux-node"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"

import { env } from "@/env"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { ProtectedCTX } from "../../trpc"

const { Video } = new Mux(env.MUX_TOKEN_ID, env.MUX_TOKEN_SECRET)

export let deleteCourseDTO = z.object({ courseId: z.string().min(1) })
type DeleteCourseDTO = z.infer<typeof deleteCourseDTO>

export async function deleteCourse({ ctx, input }: { ctx: ProtectedCTX; input: DeleteCourseDTO }) {
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
	for (const chapter of course.chapters) {
		if (chapter.muxData?.assetId) {
			await Video.Assets.del(chapter.muxData.assetId)
		}
	}

	let deletedCourse = (await db.selectDistinct().from(schema.courses).where(eq(schema.courses.id, courseId)))[0]

	await db.delete(schema.courses).where(eq(schema.courses.id, courseId))

	revalidatePath("/")
	return deletedCourse
}

export let courseValidator = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	price: z.number().optional(),
	categoryId: z.string().optional(),
})

export let patchCourseDTO = z.object({
	courseId: z.string().min(1),
	courseNewValues: courseValidator,
})

type PatchCourseDTO = z.infer<typeof patchCourseDTO>
export async function patchCourse({ ctx, input }: { ctx: ProtectedCTX; input: PatchCourseDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { courseId, courseNewValues } = input
	await db
		.update(schema.courses)
		.set({
			...courseNewValues,
		})
		.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	let course = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	)[0]

	return course
}
