import updateMuxDate from "@/scripts/Mine/update-mux-data"
import { unstable_noStore } from "next/cache"

const Page = async () => {
	unstable_noStore()

	await updateMuxDate()
	return (
		<>
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">page - update mux video</div>
		</>
	)
}

export default Page
