import { Chapter, Course, UserProgress } from "@prisma/client"

import { NavbarRoutes } from "@/components/navbar-routes"

import { CourseMobileSidebar } from "./course-mobile-sidebar"
import { auth } from "@clerk/nextjs"

interface CourseNavbarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null
		})[]
	}
	progressCount: number
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
	let { userId } = auth()
	return (
		<div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
			<CourseMobileSidebar course={course} progressCount={progressCount} />
			<NavbarRoutes userId={userId} />
		</div>
	)
}
