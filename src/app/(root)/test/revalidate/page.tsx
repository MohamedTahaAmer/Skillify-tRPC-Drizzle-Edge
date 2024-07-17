"use client"

import { useRef } from "react"
import { revalidate } from "./revalidate"
import { api } from "@/trpc/react"

const Page = () => {
	let formRef = useRef<HTMLFormElement>(null)

	let validateTRPC = api.get.validatePath.useMutation()
	let handletRPCRevalidation = async () => {
		let form = formRef.current!
		let data = new FormData(form)
		let path = data.get("name") as string
		await validateTRPC.mutateAsync({ path })
		form.reset()
	}

	return (
		<form
			ref={formRef}
			onSubmit={(e) => {
				e.preventDefault()
				let form = e.target as HTMLFormElement
				let data = new FormData(form)
				let name = data.get("name") as string
				revalidate(name)
				form.reset()
			}}
			className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col"
		>
			<input type="text" name="name" className="border-4" />
			<button className="bg-red-100 p-4">revalidate - server action</button>
			<button type="button" onClick={handletRPCRevalidation} className="bg-red-100 p-4">
				revalidate - trpc call
			</button>
		</form>
	)
}

export default Page
