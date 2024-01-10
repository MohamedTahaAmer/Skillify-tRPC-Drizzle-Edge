"use server"
import { db } from "@/lib/db"

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
