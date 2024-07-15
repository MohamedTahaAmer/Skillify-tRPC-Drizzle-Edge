import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { z } from "zod"
import { ProtectedCTX } from "../../trpc"

export let updateProgressDTO = z.object({
	isCompleted: z.boolean(),
	chapterId: z.string().min(1),
})

type UpdateProgressDTO = z.infer<typeof updateProgressDTO>
export default async function updateProgress({ ctx, input }: { ctx: ProtectedCTX; input: UpdateProgressDTO }) {
	let { db, user } = ctx
	let userId = user.id
	let { chapterId, isCompleted } = input
	let userProgress = (
		await db
			.selectDistinct()
			.from(schema.userProgress)
			.where(and(eq(schema.userProgress.userId, userId), eq(schema.userProgress.chapterId, chapterId)))
	)[0]

	if (userProgress) {
		await db
			.update(schema.userProgress)
			.set({ isCompleted })
			.where(and(eq(schema.userProgress.userId, userId), eq(schema.userProgress.chapterId, chapterId)))
	} else {
		await db.insert(schema.userProgress).values({
			userId,
			chapterId,
			isCompleted,
		})
		userProgress = (
			await db
				.selectDistinct()
				.from(schema.userProgress)
				.where(and(eq(schema.userProgress.userId, userId), eq(schema.userProgress.chapterId, chapterId)))
		)[0]
	}

	return userProgress
}
