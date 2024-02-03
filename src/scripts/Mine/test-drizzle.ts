"use server"

import { db } from "@/server/db"
import { stripeCustomers } from "@/server/db/schema"

export let main = async () => {
	try {
		await insert()
	} catch (error: unknown) {
		if (error instanceof Error) console.log("Error Message", error.message)
		console.log("Error ", error)
	}
}

let insert = async () => {
	await db
		.insert(stripeCustomers)
		.values([{ userId: "1", stripeCustomerId: "cus_123" }])

	let stripeCustomer = await db.select().from(stripeCustomers)
	console.log(stripeCustomer)
}
