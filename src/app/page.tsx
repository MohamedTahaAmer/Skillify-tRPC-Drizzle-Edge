import { db, schema } from "@/server/db"
import { and, asc, eq } from "drizzle-orm"

import { SearchInput } from "@/components/search-input"

import { logTime } from "@/lib/logTime"
import uniqBy from "lodash.uniqby"
import { Categories } from "./_components/categories"
import { CoursesList } from "@/components/courses-list"
import { Suspense } from "react"
import ShowProgressInfoCards from "./_components/show-progress-info-cards"

const SearchPage = async () => {
	let startTime = Date.now()

	startTime = Date.now()
	const allCourses = await db.query.courses.findMany({
		where: and(eq(schema.courses.isPublished, true)),
		with: {
			category: true,
			chapters: {
				where: eq(schema.chapters.isPublished, true),
				columns: {
					id: true,
				},
			},
		},
		orderBy: asc(schema.courses.createdAt),
	})
	logTime({ title: "1- Time to get all courses", startTime })

	let categories = allCourses.map((course) => course.category)
	categories = uniqBy(categories, (c) => c?.name)

	return (
		<>
			{/* search input */}
			<div className="fixed left-1/2 top-2  z-20 block  w-[65%] -translate-x-1/2 px-6 md:w-1/2 ">
				<SearchInput />
			</div>

			{/* main Content */}
			<div className="container space-y-4 py-4 lg:px-6">
				{/* category, purchased and clear badges */}
				<Categories items={categories} />

				{/* progress info cards */}
				{allCourses.length > 0 && (
					<Suspense fallback={<div>Loading...</div>}>
						<ShowProgressInfoCards />
					</Suspense>
				)}

				{/* courses list */}
				<CoursesList items={allCourses} />
			</div>
		</>
	)
}

export default SearchPage
