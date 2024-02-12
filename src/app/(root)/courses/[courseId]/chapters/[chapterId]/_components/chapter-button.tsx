"use client"
import { useCourse } from "@/hooks/use-course"
import { CourseProgressButton } from "./course-progress-button"
import { CourseEnrollButton } from "./course-enroll-button"
import { usePathname } from "next/navigation"

type ChapterButtonProps = {
	chapterId: string
	isCompleted: boolean
}
const ChapterButton = ({ chapterId, isCompleted }: ChapterButtonProps) => {
	let { isPurchased, isLastChapterToFinishTheCourse, coursePrice } = useCourse()
	let url = usePathname()
	let regex = /courses\/(.*)/
	let courseId = url.match(regex)?.[1]
	if (!courseId) return null
	return (
		<>
			{isPurchased ? (
				<CourseProgressButton
					chapterId={chapterId}
					courseId={courseId}
					isCompleted={isCompleted}
					isLastChapterToFinishTheCourse={isLastChapterToFinishTheCourse}
				/>
			) : (
				<CourseEnrollButton courseId={courseId} price={coursePrice ?? 0} />
			)}
		</>
	)
}

export default ChapterButton
