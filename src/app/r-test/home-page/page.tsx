import { SearchInput } from "@/components/search-input"

import { CoursesList } from "@/components/courses-list"
import { env } from "@/env"
import type {
	CategoriesSelect,
	ChaptersSelect,
	CoursesSelect,
} from "@/server/db/schema"
import uniqBy from "lodash.uniqby"
import { Suspense } from "react"
import { Categories } from "@/app/(root)/_components/categories"
import ShowProgressInfoCards from "@/app/(root)/_components/show-progress-info-cards"
import { TRPCReactProvider } from "@/trpc/react"

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

	let categories = allCourses.map((course) => course.category)
	categories = uniqBy(categories, (c) => c?.name)

	return (
		<TRPCReactProvider>
			<Suspense fallback={<div>Loading...</div>}>
				{/* search input */}
				<div className="fixed left-1/2 top-2 z-20 block w-[65%] -translate-x-1/2 px-6 md:w-1/2">
					<SearchInput />
				</div>

				{/* main Content */}
				<div className="container space-y-4 py-4 lg:px-6">
					{/* category, purchased and clear badges */}
					<Categories items={categories} />

					{/* progress info cards */}
					{allCourses.length > 0 && <ShowProgressInfoCards />}

					{/* courses list */}
					<CoursesList items={allCourses} />
				</div>
			</Suspense>
		</TRPCReactProvider>
	)
}

export default HomePage
