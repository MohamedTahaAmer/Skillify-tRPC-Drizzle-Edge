export const runtime = "edge"
export const preferredRegion = "cle1"

import { db, schema } from "@/server/db"
import { auth } from "@clerk/nextjs"
import { asc } from "drizzle-orm"

import { getCourses } from "@/actions/get-courses"
import { CoursesList } from "@/components/courses-list"
import { SearchInput } from "@/components/search-input"

import { Categories } from "./_components/categories"
import ProgressInfoCards from "./_components/progress-info-cards"

interface SearchPageProps {
	searchParams: {
		title?: string
		categoryId?: string
		purchased?: string
	}
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
	let { userId } = auth()
	let { purchased, categoryId, title } = searchParams

	let startTime = Date.now()
	let categories = await db.query.categories.findMany({
		orderBy: asc(schema.categories.name),
	})
	console.log('\x1b[33m%s\x1b[0m', "1- Time to categories", Date.now() - startTime)

	startTime = Date.now()
	const courses = await getCourses({
		userId,
		...searchParams,
		categoryId,
	})
	console.log('\x1b[33m%s\x1b[0m', "2- Time to getCourses", Date.now() - startTime)

	return (
		<>
			{/* search input */}
			<div className="fixed left-1/2 top-2  z-20 block  w-[65%] -translate-x-1/2 px-6 md:w-1/2 ">
				<SearchInput />
			</div>

			{/* main Content */}
			<div className="container space-y-4 py-4 lg:px-6">
				{/* category, purchased and clear cards */}
				<Categories items={categories} userId={userId} />

				{/* progress info cards */}
				{courses.length > 0 && purchased && userId && (
					<ProgressInfoCards
						userId={userId}
						categoryId={categoryId}
						title={title}
					/>
				)}

				{/* courses list */}
				<CoursesList items={courses} />
			</div>
		</>
	)
}

export default SearchPage
