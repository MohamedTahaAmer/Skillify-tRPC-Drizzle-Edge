"use server"

import callTRPC from "./call-trpc"

export default async function main() {
	// await seedCategories()
	// await seedCourses()
	// await seedAttachments()
	// await seedChapters()
	// await seedMuxData()
	// await updateMuxDate()
	// await openFirstVideo()
	// await getUserCoursesProgress(userId)
	// await addFitnessCourse()
	await callTRPC()
}
