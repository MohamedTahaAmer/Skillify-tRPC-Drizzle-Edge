"use client"
import type { Course } from "@/types"
import usePopbulateCourseStore from "../_hooks/populate-course-store"
import { usePathname } from "next/navigation"

const PopulateCourseStore = ({ course }: { course: Course }) => {
	let url = usePathname()
	let regex = /chapters\/(.*)/
	let chapterId = url.match(regex)?.[1]
	if (!chapterId) return null
	return Populate({ course, chapterId })
}

// - you can't call a hook after an early return, so we need to create a separate component to call the hook
const Populate = ({ course, chapterId }: { course: Course; chapterId: string }) => {
	usePopbulateCourseStore({ chapterId, course })
	return null
}
export default PopulateCourseStore
