import { SearchInput } from "@/components/search-input"

import { CoursesList } from "@/components/courses-list"
import { logObjSize, logTime } from "@/lib/helpers"
import { db, schema } from "@/server/db"
import { and, desc, eq } from "drizzle-orm"
import uniqBy from "lodash.uniqby"
import { Suspense } from "react"
import { Categories } from "./_components/categories"
import ShowProgressInfoCards from "./_components/show-progress-info-cards"
import { CoursesListSkeleton } from "./_components/skeletons/courses-list"
import { SearchInputSkeleton } from "./_components/skeletons/search-input"

const HomePage = async () => {
	//#region // < Allow route revalidation, by using fetch instead of direct db call
	// - I'm commenting the fetch request, as it makes development slower, by making an http request with each file save
	// type Courses = (CoursesSelect & {
	// 	category: CategoriesSelect | null
	// 	chapters: { id: ChaptersSelect["id"] }[]
	// })[]
	// console.log(
	// 	`Revalidating : ${env.NEXT_PUBLIC_APP_URL}/api/trpc/get.getAllPublishedCourses`,
	// )
	// let res = await fetch(
	// 	`${env.NEXT_PUBLIC_APP_URL}/api/trpc/get.getAllPublishedCourses`,
	// )
	// if (!res.ok) {
	// 	console.log("Failed to fetch courses")
	// 	return
	// }
	// let { result } = (await res.json()) as {
	// 	result: { data: { json: Courses } }
	// }
	// let allCourses = result.data.json
	//#endregion
	let startTime = Date.now()
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
		orderBy: desc(schema.courses.createdAt),
	})
	logTime({ title: "1- Time to get all courses", startTime })
	logObjSize({ title: "1- allCourses", obj: allCourses })

	// allCourses.splice(4)
	let categories = allCourses.map((course) => course.category)
	categories = uniqBy(categories, (c) => c?.name)

	return (
		<>
			{/* search input */}
			<div className="sdf fixed left-1/2 top-2 z-20 block w-[65%] -translate-x-1/2 px-6 md:w-1/2">
				<Suspense fallback={<SearchInputSkeleton />}>
					<SearchInput />
				</Suspense>
			</div>

			{/* main Content */}
			<div className="container space-y-4 px-2 py-4 lg:px-6">
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
