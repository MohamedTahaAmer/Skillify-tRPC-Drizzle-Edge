import { schema } from "@/server/db"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"
export async function reorderChapters({
	courseId,
	list,
	userId,
	db,
}: {
	courseId: schema.CoursesSelect["id"]
	userId: schema.CoursesSelect["userId"]
	list: {
		id: schema.ChaptersSelect["id"]
		position: schema.ChaptersSelect["position"]
	}[]
	db: PlanetScaleDatabase<typeof schema>
}) {
	const ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(
				and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			)
	)[0]

	if (!ownCourse) throw new TRPCError({ code: "FORBIDDEN" })

	for (let item of list) {
		await db
			.update(schema.chapters)
			.set({ position: item.position })
			.where(eq(schema.chapters.id, item.id))
	}

	return "Success"
}
