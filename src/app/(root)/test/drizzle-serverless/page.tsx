import { db, schema } from "@/server/db"
import { count } from "drizzle-orm"
import { unstable_noStore } from "next/cache"

const Page = async () => {
	unstable_noStore()
	let coursesCount = await db.select({ value: count() }).from(schema.courses)
	return (
		<>
			<div className="">coursesCount - {coursesCount[0]?.value} </div>
		</>
	)
}

export default Page
