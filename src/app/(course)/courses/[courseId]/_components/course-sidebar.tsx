import { auth } from "@clerk/nextjs"
import type { Chapter, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation"

import { CourseProgress } from "@/components/course-progress"
import { db } from "@/lib/db"

import { CourseSidebarItem } from "./course-sidebar-item"

interface CourseSidebarProps {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null
		})[]
	}
	progressCount: number
}

export const CourseSidebar = async ({
	course,
	progressCount,
}: CourseSidebarProps) => {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	const purchase = await db.purchase.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId: course.id,
			},
		},
	})

	return (
		<div className="flex h-full flex-col border-r shadow-sm">
			<div className="flex flex-col border-b p-8 pt-0 xl:pt-8">
				{purchase && (
					<div className="mt-2 xl:mt-10">
						<CourseProgress variant="success" value={progressCount} />
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
