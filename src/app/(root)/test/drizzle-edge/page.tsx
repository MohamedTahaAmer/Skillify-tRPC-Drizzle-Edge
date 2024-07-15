export const runtime1 = "edge"
export const preferredRegion = "cle1"

import { db, schema } from "@/server/db"
import { count } from "drizzle-orm"

const Page = async () => {
	let coursesCount = await db.select({ value: count() }).from(schema.courses)
	return (
		<>
			<div className="">coursesCount - {coursesCount[0]?.value} </div>
		</>
	)
}

export default Page
