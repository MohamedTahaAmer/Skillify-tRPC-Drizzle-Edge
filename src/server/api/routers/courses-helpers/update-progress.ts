import { db } from "@/lib/db"
export default async function updateProgress({
	userId,
	isCompleted,
	chapterId
}: {
	isCompleted: boolean
	chapterId: string
	userId: string
}) {
	const userProgress = await db.userProgress.upsert({
		where: {
			userId_chapterId: {
				userId,
				chapterId: chapterId
			}
		},
		update: {
			isCompleted
		},
		create: {
			userId,
			chapterId: chapterId,
			isCompleted
		}
	})

	return userProgress
}
