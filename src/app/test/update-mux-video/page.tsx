import updateMuxDate from "@/scripts/Mine/update-mux-data"

const Page = async () => {
	await updateMuxDate()
	return (
		<>
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				page - update mux video
			</div>
		</>
	)
}

export default Page
