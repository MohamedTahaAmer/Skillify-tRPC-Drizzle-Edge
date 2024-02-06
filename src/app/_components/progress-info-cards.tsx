import { CheckCircle, Clock } from "lucide-react"
import { getDashboardCourses } from "@/actions/get-dashboard-courses"
import { InfoCard } from "./info-card"

const ProgressInfoCards = async ({
	userId,
	categoryId,
	title,
}: {
	userId: string
	categoryId?: string
	title?: string
}) => {
	let startTime = Date.now()
	const { completedCourses, coursesInProgress } = await getDashboardCourses({
		userId,
		categoryId,
		title,
	})
	console.log(
		"\x1b[33m%s\x1b[0m",
		"3- Time to getDashboardCourses",
		Date.now() - startTime,
	)

	return (
		<div className="grid grid-cols-1 gap-4 pb-2 sm:grid-cols-2">
			<InfoCard
				icon={Clock}
				label="In Progress"
				numberOfItems={coursesInProgress.length}
			/>
			<InfoCard
				icon={CheckCircle}
				label="Completed"
				numberOfItems={completedCourses.length}
				variant="success"
			/>
		</div>
	)
}

export default ProgressInfoCards
