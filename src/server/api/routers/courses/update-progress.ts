import { schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"

export default async function updateProgress({
	userId,
	isCompleted,
	chapterId,
	db,
}: {
	isCompleted: schema.UserProgressInsert["isCompleted"]
	chapterId: schema.UserProgressInsert["chapterId"]
	userId: schema.UserProgressInsert["userId"]
	db: PlanetScaleDatabase<typeof schema>
}) {
	let userProgress = (
		await db
			.selectDistinct()
			.from(schema.userProgress)
			.where(
				and(
					eq(schema.userProgress.userId, userId),
					eq(schema.userProgress.chapterId, chapterId),
				),
			)
	)[0]

	if (userProgress) {
		await db
			.update(schema.userProgress)
			.set({ isCompleted })
			.where(
				and(
					eq(schema.userProgress.userId, userId),
					eq(schema.userProgress.chapterId, chapterId),
				),
			)
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
				.where(
					and(
						eq(schema.userProgress.userId, userId),
						eq(schema.userProgress.chapterId, chapterId),
					),
				)
		)[0]
	}

	return userProgress
}
