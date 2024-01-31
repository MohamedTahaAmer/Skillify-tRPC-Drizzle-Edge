import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { SearchInput } from "@/components/search-input"
import { getCourses } from "@/actions/get-courses"
import { CoursesList } from "@/components/courses-list"

import { Categories } from "./_components/categories"
import ProgressInfoCards from "./_components/progress-info-cards"

interface SearchPageProps {
	searchParams: {
		title: string
		categoryId: string
		purchaced: string
	}
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
	const { userId } = auth()
	let { purchaced, categoryId, title } = searchParams

	if (!userId) {
		return redirect("/")
	}

	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	})

	const courses = await getCourses({
		userId,
		...searchParams,
	})

	return (
		<>
			{/* search input */}
			<div className="fixed left-1/2 top-2  z-20 block  w-[65%] -translate-x-1/2 px-6 md:w-1/2 ">
				<SearchInput />
			</div>

			{/* main Content */}
			<div className="container space-y-4 py-4 lg:px-6">
				{/* category, purchased and clear cards */}
				<Categories items={categories} />

				{/* progress info cards */}
				{courses.length > 0 && purchaced && (
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
