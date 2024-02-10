import SearchParam from "@/app/(root)/test/courses-num/search-param"
import { env } from "@/env"
import type {
	CategoriesSelect,
	ChaptersSelect,
	CoursesSelect,
} from "@/server/db/schema"
import { Suspense } from "react"

const HomePage = async () => {
	type Courses = (CoursesSelect & {
		category: CategoriesSelect | null
		chapters: { id: ChaptersSelect["id"] }[]
	})[]
	console.log(`${env.NEXT_PUBLIC_APP_URL}/api/trpc/get.getAllPublishedCourses`)
	let res = await fetch(
		`${env.NEXT_PUBLIC_APP_URL}/api/trpc/get.getAllPublishedCourses`,
	)
	if (!res.ok) {
		console.log("Failed to fetch courses")
		return
	}
	let { result } = (await res.json()) as {
		result: { data: { json: Courses } }
	}
	let allCourses = result.data.json
	console.log(allCourses.length)

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div>Number of courses = {allCourses.length}</div>
			<SearchParam />
		</Suspense>
	)
}

export default HomePage
