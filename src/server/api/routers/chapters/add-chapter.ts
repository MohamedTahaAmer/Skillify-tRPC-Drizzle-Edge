import { ProtectedCTX } from "@/server/api/trpc"
import { schema } from "@/server/db"
import { TRPCError } from "@trpc/server"
import { and, desc, eq } from "drizzle-orm"

import { revalidatePath } from "next/cache"
import { z } from "zod"

export let addChapterDTO = z.object({
	courseId: z.string().min(1),
	title: z.string().min(1),
})
type AddChapterDTO = z.infer<typeof addChapterDTO>
export async function addChapter({
	ctx,
	input,
}: {
	ctx: ProtectedCTX
	input: AddChapterDTO
}) {
	let { db, user } = ctx
	let userId = user.id
	let { courseId, title } = input
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
	revalidatePath("/")
	return chapter
}
