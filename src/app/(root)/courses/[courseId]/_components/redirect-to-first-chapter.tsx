"use client"

import type { Route } from "next"
import { usePathname, useRouter } from "next/navigation"

const RedirectToFirstChapter = ({ firstChapterId }: { firstChapterId: string }) => {
	let path = usePathname()
	let router = useRouter()

	if (path.includes("chapters") === false) {
		router.push(`${path}/chapters/${firstChapterId}` as Route)
	}
	return null
}

export default RedirectToFirstChapter
