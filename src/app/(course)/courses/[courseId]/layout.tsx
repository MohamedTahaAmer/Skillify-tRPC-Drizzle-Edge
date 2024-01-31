import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { getProgress } from "@/actions/get-progress"
import { db } from "@/lib/db"

import { CourseNavbar } from "./_components/course-navbar"
import { CourseSidebar } from "./_components/course-sidebar"

const CourseLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode
	params: { courseId: string }
}) => {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
		},
		include: {
			chapters: {
				where: {
					isPublished: true,
				},
				include: {
					userProgress: {
						where: {
							userId,
						},
					},
				},
				orderBy: {
					position: "asc",
				},
			},
		},
	})

	if (!course) {
		return redirect("/")
	}

	const progressCount = await getProgress(userId, course.id)

	return (
		<div className="h-full">
			<div className="fixed inset-y-0 z-10 h-[60px] w-full">
				<CourseNavbar course={course} progressCount={progressCount} />
			</div>
			<h1 className="fixed left-1/2 top-3 z-20 hidden -translate-x-1/2 truncate rounded-full border border-sky-300 bg-slate-100 px-4 py-1 text-lg font-bold text-sky-800 xl:block">
				{course.title}
			</h1>
			<div className="inset-y-0 hidden  h-full w-80 flex-col xl:fixed xl:flex">
				<CourseSidebar course={course} progressCount={progressCount} />
			</div>
			<main className="h-full md:px-6 xl:pl-80">{children}</main>
		</div>
	)
}

export default CourseLayout
