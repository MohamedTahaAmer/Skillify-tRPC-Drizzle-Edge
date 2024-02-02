import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"

export default async function updateProgress({
	userId,
	isCompleted,
	chapterId,
	db,
}: {
	isCompleted: boolean
	chapterId: string
	userId: string
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}) {
	const userProgress = await db.userProgress.upsert({
		where: {
			userId_chapterId: {
				userId,
				chapterId: chapterId,
			},
		},
		update: {
			isCompleted,
		},
		create: {
			userId,
			chapterId: chapterId,
			isCompleted,
		},
	})

	return userProgress
}
