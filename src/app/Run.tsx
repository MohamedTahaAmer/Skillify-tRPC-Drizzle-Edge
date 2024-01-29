"use client"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

const Run = () => {
	let onClick = async () => {
		// await seedCategories()
		toast.success("Categories seeded")
	}
	return (
		<>
			<Button
				onClick={onClick}
				className="fixed left-48 top-0 z-[51]"
				variant="ghost"
			>
				Run
			</Button>
		</>
	)
}

export default Run
