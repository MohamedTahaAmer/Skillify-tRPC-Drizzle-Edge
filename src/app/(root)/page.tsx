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
import { Categories } from "./_components/categories"
import ShowProgressInfoCards from "./_components/show-progress-info-cards"
import { SearchInputSkeleton } from "./_components/skeletons/search-input"
import { CoursesListSkeleton } from "./_components/skeletons/courses-list"

const HomePage = async () => {
	type Courses = (CoursesSelect & {
		category: CategoriesSelect | null
		chapters: { id: ChaptersSelect["id"] }[]
	})[]
	console.log(
		`Revalidating : ${env.NEXT_PUBLIC_APP_URL}/api/trpc/get.getAllPublishedCourses`,
	)
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
		<>
			{/* search input */}
			<div className="fixed left-1/2 top-2  z-20 block  w-[65%] -translate-x-1/2 px-6 md:w-1/2 ">
				<Suspense fallback={<SearchInputSkeleton />}>
					<SearchInput />
				</Suspense>
			</div>

			{/* main Content */}
			<div className="container space-y-4 py-4 lg:px-6">
				{/* category, purchased and clear badges */}
				<Categories items={categories} />

				{/* progress info cards */}
				{allCourses.length > 0 && (
					<Suspense fallback={null}>
						<ShowProgressInfoCards />
					</Suspense>
				)}

				{/* courses list */}
				<Suspense fallback={<CoursesListSkeleton items={allCourses} />}>
					<CoursesList items={allCourses} />
				</Suspense>
			</div>
		</>
	)
}

export default HomePage
