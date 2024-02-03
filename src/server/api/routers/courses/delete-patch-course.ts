import { schema } from "@/server/db"
import Mux from "@mux/mux-node"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"

import { env } from "@/env"
import { z } from "zod"

const { Video } = new Mux(env.MUX_TOKEN_ID, env.MUX_TOKEN_SECRET)
export async function deleteCourse({
	courseId,
	userId,
	db,
}: {
	courseId: schema.CoursesSelect["id"]
	userId: schema.CoursesSelect["userId"]
	db: PlanetScaleDatabase<typeof schema>
}) {
	let course = (
		await db.query.courses.findMany({
			where: and(
				eq(schema.courses.id, courseId),
				eq(schema.courses.userId, userId),
			),
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
	if (!course)
		throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" })
	for (const chapter of course.chapters) {
		if (chapter.muxData?.assetId) {
			await Video.Assets.del(chapter.muxData.assetId)
		}
	}

	let deletedCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(eq(schema.courses.id, courseId))
	)[0]

	await db.delete(schema.courses).where(eq(schema.courses.id, courseId))

	return deletedCourse
}

export let courseValidator = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	price: z.number().optional(),
	categoryId: z.string().optional(),
})
type courseValidatorType = z.infer<typeof courseValidator>
export async function patchCourse({
	courseId,
	userId,
	courseNewValues,
	db,
}: {
	courseId: schema.CoursesSelect["id"]
	userId: schema.CoursesSelect["userId"]
	courseNewValues: courseValidatorType
	db: PlanetScaleDatabase<typeof schema>
}) {
	await db
		.update(schema.courses)
		.set({
			...courseNewValues,
		})
		.where(
			and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
		)
	let course = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(
				and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			)
	)[0]

	return course
}
