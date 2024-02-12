"use client"

import { Banner } from "@/components/banner"
import { useCourse } from "@/hooks/use-course"

const ShowBanner = () => {
	// - strange, next.js server can read values from zstand now
	// I think it's that zustand update works fine with SSR, and I'm updating the couseSotre without wrapping it with suspense, so the server will also run the store update hook
	let { isPurchased } = useCourse()
	if (isPurchased) return null
	return (
		<Banner
			variant="warning"
			label="You need to purchase this course to watch this chapter."
		/>
	)
}

export default ShowBanner
