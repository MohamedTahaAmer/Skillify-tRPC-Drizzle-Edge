"use client"
import { CourseProgress, type CourseProgressProps } from "@/components/course-progress"
import { useCourse } from "@/hooks/use-course"
import { useProgressMap } from "@/hooks/use-progress-map"
import { useEffect } from "react"

const CourseSidebarProgress = ({ value, size, variant }: CourseProgressProps) => {
	let { courseId } = useCourse()
	let { progressMap, setProgressMap } = useProgressMap()
	useEffect(() => {
		if (courseId) {
			setProgressMap(progressMap ? { ...progressMap, [courseId]: value } : { [courseId]: value })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [courseId, value, setProgressMap])
	if (!courseId) return null
	let newValue = progressMap?.[courseId] ?? value

	return <CourseProgress variant={variant} size={size} value={newValue} />
}

export default CourseSidebarProgress
