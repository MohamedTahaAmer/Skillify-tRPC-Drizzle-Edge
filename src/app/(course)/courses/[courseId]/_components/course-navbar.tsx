import type { Chapter, Course, UserProgress } from "@prisma/client"

import { CourseMobileSidebar } from "./course-mobile-sidebar"

interface CourseNavbarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null
		})[]
	}
	progressCount: number
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
	return (
		<div className="fixed left-1/2 top-3 z-20  -translate-x-1/2   ">
			<CourseMobileSidebar course={course} progressCount={progressCount} />
		</div>
	)
}
