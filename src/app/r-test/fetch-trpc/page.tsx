"use client"

import { env } from "@/env"
import { Button } from "@/components/ui/button"
// import { api } from "@/trpc/react"

const HomePage = () => {
	async function fetchCourses() {
		console.log(`${env.NEXT_PUBLIC_APP_URL}/api/trpc/get.getAllPublishedCourses`)
		const res = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/trpc/get.getAllPublishedCourses`)
		console.log(res)
		if (!res.ok) {
			console.log("Failed to fetch courses")
			return
		}
		const { result } = await res.json()
		const allCourses = result.data.json
		console.log(allCourses.length)
	}
	// let trpcRequest = api.get.getAllPublishedCourses.useQuery()
	// console.log(trpcRequest.data)
	return (
		<>
			<div className="">Home</div>
			<Button className="ml-auto block" onClick={fetchCourses}>
				Fetch Courses
			</Button>
		</>
	)
}

export default HomePage
