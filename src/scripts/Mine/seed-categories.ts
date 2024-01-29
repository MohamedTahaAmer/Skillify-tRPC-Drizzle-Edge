"use server"
import { db } from "@/lib/db"
import { api } from "@/trpc/server"
import { api as apiCleint } from "@/trpc/react"

export async function seedCategories() {
	try {
		await db.category.createMany({
			data: [
				{ name: "Computer Science" },
				{ name: "Music" },
				{ name: "Fitness" },
				{ name: "Photography" },
				{ name: "Accounting" },
				{ name: "Engineering" },
				{ name: "Filming" }
			]
		})

		console.log("Success")
	} catch (error) {
		console.log("Error seeding the database categories", error)
	}
}

export async function getCategories() {
	// return "getCategories"
	return await db.category.findMany()
}

export async function helloTRPC() {
	// return "helloTRPC"
	return api.post.hello.query({ text: "Hello World" })
}

export async function helloTRPCClient() {
	console.log("TEST")
	// return "helloTRPC"
	return apiCleint.post.hello.useQuery({ text: "Hello World" })
}
