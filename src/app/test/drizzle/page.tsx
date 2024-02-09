import { db, schema } from "@/server/db"
import { count } from "drizzle-orm"

const Page = async () => {
	// revalidate this path and see if it will error
	let coursesCount = await db.select({ value: count() }).from(schema.courses)
	console.log(coursesCount)
	return (
		<>
			<div className="">coursesCount - {coursesCount[0]?.value} </div>
		</>
	)
}

export default Page
