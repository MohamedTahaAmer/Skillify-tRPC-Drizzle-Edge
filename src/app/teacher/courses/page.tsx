import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { db, schema } from "@/server/db"
import { desc, eq } from "drizzle-orm"

import { unstable_noStore } from "next/cache"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"

const CoursesPage = async () => {
	unstable_noStore()
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	let courses = await db.query.courses.findMany({
		where: eq(schema.courses.userId, userId),
		orderBy: desc(schema.courses.createdAt),
	})

	return (
		<div className="p-6">
			<DataTable columns={columns} data={courses} />
		</div>
	)
}

export default CoursesPage
