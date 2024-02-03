"use client"
import { Button } from "@/components/ui/button"
import { getCategories, seedCategories } from "@/scripts/Mine/seed-categories"
import { main } from "@/scripts/Mine/test-drizzle"
import toast from "react-hot-toast"

const Run = () => {
	let onClick = async () => {
		await seedCategories()
		toast.success("Categories seeded")
		// let stripeCustomer = await main()
		// console.log(stripeCustomer)
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
