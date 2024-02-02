import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"

import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { unstable_noStore } from "next/cache"

const CoursesPage = async () => {
	unstable_noStore()
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	const courses = await db.course.findMany({
		where: {
			userId,
		},
		orderBy: {
			createdAt: "desc",
		},
	})

	return (
		<div className="p-6">
			<DataTable columns={columns} data={courses} />
		</div>
	)
}

export default CoursesPage
