import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { SearchInput } from "@/components/search-input"
import { getCourses } from "@/actions/get-courses"
import { CoursesList } from "@/components/courses-list"

import { Categories } from "./_components/categories"
import ProgressInfoCards from "./_components/ProgressInfoCards"

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
			<div className="fixed left-1/2 top-2  z-20 block w-1/2 -translate-x-1/2 px-6 ">
				<SearchInput />
			</div>
			<div className="space-y-4 p-6">
				<div className="container">
					<Categories items={categories} />
					{courses.length > 0 && purchaced && (
						<ProgressInfoCards
							userId={userId}
							categoryId={categoryId}
							title={title}
						/>
					)}
					<CoursesList items={courses} />
				</div>
			</div>
		</>
	)
}

export default SearchPage
