import { db } from "@/server/db"

const Page = async () => {
	let course = await db.query.courses.findFirst()
	console.log(course?.title)
	return (
		<>
			<div className="">page</div>
		</>
	)
}

export default Page
