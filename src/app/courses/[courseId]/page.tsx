export const runtime = "edge"
import { db, schema } from "@/server/db"
import { asc, eq } from "drizzle-orm"
import { redirect } from "next/navigation"

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
	let course = await db.query.courses.findFirst({
		where: eq(schema.courses.id, params.courseId),
		with: {
			chapters: {
				where: eq(schema.chapters.isPublished, true),
				orderBy: asc(schema.chapters.position),
			},
		},
	})

	if (!course) {
		return redirect("/")
	}
	return redirect(`/courses/${course.id}/chapters/${course.chapters[0]?.id}`)
}

export default CourseIdPage
