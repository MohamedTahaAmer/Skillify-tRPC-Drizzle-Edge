import { env } from "@/env"

export default async function callTRPC() {
	console.log(env.NEXT_PUBLIC_APP_URL)
	let res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/trpc/get.getAllPublishedCourses`)
	if (!res.ok) {
		console.log("Failed to fetch courses")
		return
	}
	let { result } = (await res.json()) as {
		result: { data: { json: number } }
	}
	let courses = result.data.json
	console.log(courses)
}
