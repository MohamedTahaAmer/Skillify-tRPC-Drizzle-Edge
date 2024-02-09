"use server"

import { addFitnessCourse } from "./drizzle"

export default async function main() {
	// await seedCategories()
	// await seedCourses()
	// await seedAttachments()
	// await seedChapters()
	// await seedMuxData()
	// await updateMuxDate()
	// await openFirstVideo()
	// await getUserCoursesProgress(userId)
	return addFitnessCourse()
	// await callTRPC()
}
