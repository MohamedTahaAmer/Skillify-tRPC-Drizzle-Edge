import type { Course } from "@/types"
import { CourseSidebarItem } from "./course-sidebar-item"
import CourseSidebarProgress from "./course-sidebar-progress"

export const CourseSidebar = async ({ course }: { course: Course }) => {
	let purchase = course.purchases
	let getProgressPercentage = () => {
		let numOfCompletedChapters = course.chapters.reduce((acc, chapter) => {
			if (chapter.userProgress[0]?.isCompleted) {
				acc++
			}
			return acc
		}, 0)
		let numOfChapters = course.chapters.length

		let progressPercentage = Math.floor(
			(numOfCompletedChapters / numOfChapters) * 100,
		)
		return progressPercentage
	}
	return (
		<div className="flex h-full flex-col border-r shadow-sm">
			<div className="flex flex-col border-b p-4">
				<h1 className="truncate text-lg font-bold text-emerald-700">
					{course.title}
				</h1>
				{purchase && (
					<div className="pt-2">
						<CourseSidebarProgress value={getProgressPercentage()} />
					</div>
				)}
			</div>
			<div className="flex w-full flex-col">
				{course.chapters.map((chapter) => (
					<CourseSidebarItem
						key={chapter.id}
						id={chapter.id}
						label={chapter.title}
						isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
						courseId={course.id}
						isLocked={!chapter.isFree && !purchase}
					/>
				))}
			</div>
		</div>
	)
}
