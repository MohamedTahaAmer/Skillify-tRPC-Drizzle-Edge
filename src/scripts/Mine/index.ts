"use server"

import { getUserProgress } from "./drizzle"

export default async function main({ userId }: { userId: string }) {
	// await seedCategories()
	// await seedCourses()
	// await seedAttachments()
	// await seedChapters()
	// await seedMuxData()
	// await updateMuxDate()
	// await openFirstVideo()
	await getUserProgress(userId)
}
