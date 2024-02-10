import { schema } from "@/server/db"
import { TRPCError } from "@trpc/server"
import { and, desc, eq } from "drizzle-orm"
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"
import { revalidatePath } from "next/cache"
export async function addChapter({
	courseId,
	title,
	userId,
	db,
}: {
	courseId: schema.CoursesSelect["id"]
	userId: schema.CoursesSelect["userId"]
	title: schema.ChaptersSelect["title"]
	db: PlanetScaleDatabase<typeof schema>
}) {
	let courseOwner = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(
				and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)),
			)
	)[0]

	if (!courseOwner) throw new TRPCError({ code: "FORBIDDEN" })

	let lastChapter = (
		await db
			.selectDistinct()
			.from(schema.chapters)
			.where(eq(schema.chapters.courseId, courseId))
			.orderBy(desc(schema.chapters.position))
	)[0]

	const newPosition = lastChapter ? lastChapter.position + 1 : 1

	await db
		.insert(schema.chapters)
		.values({ title, courseId, position: newPosition })
	let chapter = (
		await db
			.selectDistinct()
			.from(schema.chapters)
			.where(
				and(
					eq(schema.chapters.title, title),
					eq(schema.chapters.courseId, courseId),
					eq(schema.chapters.position, newPosition),
				),
			)
	)[0]
	revalidatePath('/')
	return chapter
}
