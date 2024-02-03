"use server"

import { db, schema } from "@/server/db"

export async function seedCategories() {
	try {
		await db
			.insert(schema.categories)
			.values([
				{ name: "Computer Science" },
				{ name: "Music" },
				{ name: "Fitness" },
				{ name: "Photography" },
				{ name: "Accounting" },
				{ name: "Engineering" },
				{ name: "Filming" },
			])
		console.log("Success")
	} catch (error) {
		console.log("Error seeding the database categories", error)
	}
}

export async function getCategories() {
	return await db.query.categories.findMany()
}
