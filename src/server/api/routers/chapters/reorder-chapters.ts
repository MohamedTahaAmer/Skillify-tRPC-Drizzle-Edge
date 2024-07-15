import { ProtectedCTX } from "@/server/api/trpc"
import { schema } from "@/server/db"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

export let reorderChaptersDTO = z.object({
	courseId: z.string().min(1),
	list: z.object({ id: z.string().min(1), position: z.number() }).array(),
})

type ReorderChaptersDTO = z.infer<typeof reorderChaptersDTO>
export async function reorderChapters({ ctx, input }: { ctx: ProtectedCTX; input: ReorderChaptersDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { courseId, list } = input
	const ownCourse = (
		await db
			.selectDistinct()
			.from(schema.courses)
			.where(and(eq(schema.courses.id, courseId), eq(schema.courses.userId, userId)))
	)[0]

	if (!ownCourse) throw new TRPCError({ code: "FORBIDDEN" })

	for (let item of list) {
		await db.update(schema.chapters).set({ position: item.position }).where(eq(schema.chapters.id, item.id))
	}

	return "Success"
}
