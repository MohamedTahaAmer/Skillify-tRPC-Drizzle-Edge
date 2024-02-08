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
	let { data: userPorgress } = api.get.getUserCoursesProgress.useQuery({
		userId,
		categoryId,
		title,
	})
	return (
		<div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2">
			<InfoCard
				icon={Clock}
				label="In Progress"
				numberOfItems={userPorgress?.numOfUnCompletedCourses ?? 0}
			/>
			<InfoCard
				icon={CheckCircle}
				label="Completed"
				numberOfItems={userPorgress?.numOfCompletedCourses ?? 0}
				variant="success"
			/>
		</div>
	)
}

export default ProgressInfoCards
