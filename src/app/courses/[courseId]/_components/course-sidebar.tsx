import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { CourseProgress } from "@/components/course-progress"
import { db, schema } from "@/server/db"
import { and, eq } from "drizzle-orm"
import { CourseSidebarItem } from "./course-sidebar-item"

interface CourseSidebarProps {
	course: schema.CoursesSelect & {
		chapters: (schema.ChaptersSelect & {
			userProgress: schema.UserProgressSelect[] | null
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

	let purchase = await db.query.purchases.findFirst({
		where: and(
			eq(schema.purchases.userId, userId),
			eq(schema.purchases.courseId, course.id),
		),
	})
	return (
		<div className="flex h-full flex-col border-r shadow-sm">
			<div className="flex flex-col border-b p-4">
				<h1 className="truncate text-lg font-bold text-emerald-700">
					{course.title}
				</h1>
				{purchase && (
					<div className="pt-2">
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
