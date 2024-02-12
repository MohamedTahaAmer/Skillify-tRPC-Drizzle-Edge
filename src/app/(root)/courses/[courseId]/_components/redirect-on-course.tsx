"use client"

import { usePathname } from "next/navigation"

const RedirectOnCourse = () => {
	let path = usePathname()
	console.log(path)
	return (
		<>
			<div className="">redirect-on-course</div>
		</>
	)
}

export default RedirectOnCourse
