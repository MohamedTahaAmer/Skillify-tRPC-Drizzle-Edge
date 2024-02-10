import { CourseProgress } from "@/components/course-progress"
import type { schema } from "@/server/db"
import { CourseSidebarItem } from "./course-sidebar-item"

interface CourseSidebarProps {
	course: schema.CoursesSelect & {
		chapters: (schema.ChaptersSelect & {
			userProgress: schema.UserProgressSelect[]
		})[]
		purchases: schema.PurchasesSelect[]
	}
}

export const CourseSidebar = async ({ course }: CourseSidebarProps) => {
	let purchase = course.purchases.length !== 0
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
	return (
		<div className="flex h-full flex-col border-r shadow-sm">
			<div className="flex flex-col border-b p-4">
				<h1 className="truncate text-lg font-bold text-emerald-700">
					{course.title}
				</h1>
				{purchase && (
					<div className="pt-2">
						<CourseProgress variant="success" value={progressPercentage} />
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
