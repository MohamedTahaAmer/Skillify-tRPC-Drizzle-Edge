import { useCourse } from "@/hooks/use-course"
import type { Course } from "@/types"
import { useEffect } from "react"

export default function usePopbulateCourseStore({
	course,
	chapterId,
}: {
	course: Course
	chapterId: string
}) {
	let {
		setIsPurchased,
		setIsLastChapterToFinishTheCourse,
		setNextChapterId,
		setAttachments,
		setCoursePrice,
		setCourseId,
		setNumberOfChapters,
	} = useCourse()
	useEffect(() => {
		setAttachments(course.attachments)
		setCourseId(course.id)

		let purchase = course.purchases ? true : false
		setIsPurchased(purchase)

		let coursePrice = course.price
		if (coursePrice) setCoursePrice(coursePrice)

		if (purchase) {
			let numOfCompletedChapters = course.chapters.reduce((acc, chapter) => {
				if (chapter.userProgress[0]?.isCompleted) {
					acc++
				}
				return acc
			}, 0)
			let numOfPublishedChapters = course.chapters.length
			let lastChapterToFinishTheCourse =
				numOfPublishedChapters - numOfCompletedChapters === 1
			setIsLastChapterToFinishTheCourse(lastChapterToFinishTheCourse)
		}

		let currentChapterIndex = course.chapters.findIndex(
			(chapter) => chapter.id === chapterId,
		)
		let nextChapter = course.chapters[currentChapterIndex + 1]

		if (nextChapter) {
			setNextChapterId(nextChapter.id)
		}

		setNumberOfChapters(course.chapters.length)
	}, [
		course,
		chapterId,
		setIsPurchased,
		setIsLastChapterToFinishTheCourse,
		setNextChapterId,
		setAttachments,
		setCoursePrice,
		setCourseId,
		setNumberOfChapters,
	])
}
