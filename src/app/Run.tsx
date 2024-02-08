"use client"
import { Button } from "@/components/ui/button"
import main from "@/scripts/Mine"
import toast from "react-hot-toast"

const Run = () => {
	// let { user } = useUser()
	let onClick = async () => {
		await main()
		toast.success("Action Done !")
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
