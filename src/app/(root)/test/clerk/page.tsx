import { auth } from "@clerk/nextjs/server"

const Page = () => {
	let { userId } = auth()
	console.log("TEST", userId)
	return (
		<>
			<div className="">page</div>
		</>
	)
}

export default Page
