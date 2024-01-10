"use client"
import { Button } from "@/components/ui/button"
import { seedCategories } from "@/scripts/Mine/seed-categories"
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
				className="fixed top-0 left-48 z-[51]"
				variant="ghost"
			>
				Run
			</Button>
		</>
	)
}

export default Run
