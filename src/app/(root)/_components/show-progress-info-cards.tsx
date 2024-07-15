"use client"
import { useSearchParams } from "next/navigation"
import ProgressInfoCards from "./progress-info-cards"
import { useUser } from "@/hooks/useUser"

const ShowProgressInfoCards = () => {
	let searchParams = Object.fromEntries(useSearchParams().entries())
	let { user } = useUser()
	return (
		<>
			{searchParams.purchased && user?.id && (
				<ProgressInfoCards categoryId={searchParams.categoryId} title={searchParams.title} />
			)}
		</>
	)
}

export default ShowProgressInfoCards
