"use client"
import { api } from "@/trpc/react"
import { CheckCircle, Clock } from "lucide-react"
import { InfoCard } from "./info-card"

const ProgressInfoCards = ({
	userId,
	categoryId,
	title,
}: {
	userId: string
	categoryId?: string
	title?: string
}) => {
	let { data: courses } = api.get.getUserCoursesWithProgress.useQuery(
		{
			userId,
		},
		{
			refetchOnMount: false,
		},
	)
	categoryId &&
		(courses = courses?.filter((course) => course.categoryId === categoryId))
	title?.length &&
		(courses = courses?.filter((course) => course.title.includes(title)))

	let numOfCompletedCourses = courses?.reduce((acc, course) => {
		let numOfAllChapters = course.chapters.length
		let numOfCompletedChapters = course.chapters.reduce((acc, chapter) => {
			if (chapter.userProgress.length > 0) {
				acc++
			}
			return acc
		}, 0)
		if (numOfAllChapters === numOfCompletedChapters) {
			acc++
		}
		return acc
	}, 0)
	let numOfUnCompletedCourses =
		(courses?.length ?? 0) - (numOfCompletedCourses ?? 0)

	return (
		<div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2">
			<InfoCard
				icon={Clock}
				label="In Progress"
				numberOfItems={numOfUnCompletedCourses ?? 0}
			/>
			<InfoCard
				icon={CheckCircle}
				label="Completed"
				numberOfItems={numOfCompletedCourses ?? 0}
				variant="success"
			/>
		</div>
	)
}

export default ProgressInfoCards
