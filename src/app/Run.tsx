// "use client"
// import { Button } from "@/components/ui/button"
// import { getCategories, helloTRPC } from "@/scripts/Mine/seed-categories"
// import { api } from "@/trpc/react"
// import { useState } from "react"
// import toast from "react-hot-toast"

// const Run = () => {
// 	const [test, setTest] = useState("")
// 	api.post.hello.useQuery(
// 		{ text: "Hello" },
// 		{
// 			onSuccess: (data) => {
// 				console.log("TEST", "onSuccess", data)
// 				setTest(data.greeting)
// 			}
// 		}
// 	)
// 	let onClick = async () => {
// 		// await seedCategories()
// 		console.log("TEST", "Run")
// 		// - strange that i can await server side functions, in the client without them being a server action or an API endpoint, or a trpc query
// 		let categories = await getCategories()
// 		console.log("TEST", "categories", categories)
// 		toast.success("Categories seeded")

// 		// also here from the client i can make a server trpc call
// 		let hellotrpc = await helloTRPC()
// 		console.log("TEST", "hellotrpc", hellotrpc)
// 		console.log("TEST")
// 		console.log(window)
// 	}
// 	return (
// 		<>
// 			<Button
// 				onClick={onClick}
// 				className="fixed left-48 top-0 z-[51]"
// 				variant="ghost"
// 			>
// 				Run - {test}
// 			</Button>
// 		</>
// 	)
// }

// export default Run
