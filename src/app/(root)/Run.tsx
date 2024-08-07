"use client"
import { Button } from "@/components/ui/button"
import main from "@/scripts/Mine"
import toast from "react-hot-toast"

const Run = () => {
	let onClick = async () => {
		let course = await main()
		toast.success(`Course: ${course?.title} was created successfully!`)
	}
	return (
		<>
			<Button onClick={onClick} className="fixed left-48 top-0 z-[51]" variant="ghost">
				Run
			</Button>
		</>
	)
}

export default Run
