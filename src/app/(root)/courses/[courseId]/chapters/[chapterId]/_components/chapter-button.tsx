"use client"
import { useCourse } from "@/hooks/use-course"
import { CourseEnrollButton } from "./course-enroll-button"
import { CourseProgressButton } from "./course-progress-button"

type ChapterButtonProps = {
	chapterId: string
	isCompleted: boolean
}
const ChapterButton = ({ chapterId, isCompleted }: ChapterButtonProps) => {
	let { isPurchased, isLastChapterToFinishTheCourse, courseId } = useCourse()
	if (!courseId) return null
	return (
		<>
			{isPurchased ? (
				<CourseProgressButton
					chapterId={chapterId}
					isCompleted={isCompleted}
					isLastChapterToFinishTheCourse={isLastChapterToFinishTheCourse}
				/>
			) : (
				<CourseEnrollButton />
			)}
		</>
	)
}

export default ChapterButton
