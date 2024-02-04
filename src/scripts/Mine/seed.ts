import { db, schema } from "@/server/db"
import { eq } from "drizzle-orm"

export let userId = "user_2agUwB33larEJrVqdkUgDlHC9Vz"
export let categories = {
	"Computer Science": "Computer Science",
	fitness: "Fitness",
	photography: "Photography",
	accounting: "Accounting",
	engineering: "Engineering",
}
export let coursesPrices = {
	"Computer Science": [99.99, 149.99, 79.99, 199.99, 129.99],
	fitness: [49.99, 79.99, 59.99, 69.99, 89.99],
	photography: [69.99, 119.99, 89.99, 149.99, 99.99],
	accounting: [79.99, 129.99, 99.99, 159.99, 109.99],
	engineering: [89.99, 139.99, 109.99, 179.99, 119.99],
}

export let seedCategories = async () => {
	try {
		await db
			.insert(schema.categories)
			.values([
				{ name: categories["Computer Science"] },
				{ name: categories.accounting },
				{ name: categories.engineering },
				{ name: categories.fitness },
				{ name: categories.photography },
			])
		console.log("seeded categories")
	} catch (error) {
		console.log("Error seeding the database categories", error)
	}
}

export let seedCourses = async () => {
	try {
		// - you can't send the type to the db and infer it back, so you must cast it
		let dbCategories = await db.query.categories.findMany()

		const getKeyFromValue = <T>(value: string, categories: T): keyof T => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			return Object.keys(categories).find((key) => categories[key] === value)
		}
		let { imageUrls } = await import("./image-urls")
		let { coursesTitles } = await import("./courses-titels")
		let { coursesDescriptions } = await import("./courses-descriptions")

		for (let category of dbCategories) {
			// console.log(category.name)
			// console.log(category.name === "Computer Science")
			// console.log(coursesTitles[category.name])
			// console.log(coursesTitles[getKeyFromValue(category.name, categories)])

			let categoryKey = getKeyFromValue(category.name, categories)
			for (let title of coursesTitles[categoryKey]) {
				let index = coursesTitles[categoryKey].indexOf(title)
				let imageUrl = imageUrls[categoryKey][index]
				let price = coursesPrices[categoryKey][index]
				let description = coursesDescriptions[categoryKey][index]
				await db.insert(schema.courses).values({
					userId,
					title,
					description,
					imageUrl,
					price,
					categoryId: category.id,
					isPublished: true,
				})
				console.log("inserted course", title, "in", category.name, "category")
			}
		}
		console.log("seeded courses")
	} catch (error) {
		console.log("Error seeding the database courses", error)
	}
}

export let seedAttachments = async () => {
	try {
		let courses = await db.query.courses.findMany()
		for (let course of courses) {
			let name = "Attachment - Build - Logs - Edge"
			let url =
				"https://utfs.io/f/d19a7595-4ebe-418c-9eed-99ad408f73a2-m477hg.jpg"
			let courseId = course.id
			await db.insert(schema.attachments).values({
				name,
				url,
				courseId,
			})
		}
		console.log("seeded attachments")
	} catch (error) {
		console.log("Error seeding the database attachments", error)
	}
}

export let seedChapters = async () => {
	try {
		let courses = await db.query.courses.findMany()
		for (let course of courses) {
			for (let i = 0; i < 5; i++) {
				let title = `${course.title} - Chapter ${i + 1}`
				let courseId = course.id
				let videoUrl =
					"https://utfs.io/f/29dc41e5-d9a2-4ef7-93f0-5d243cb4aaa4-nae63u.mp4"
				let position = i + 1
				let isPublished = true
				let isFree = i === 0
				let description = `<p><strong>${course.title} </strong></p>
				<p>lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`
				await db.insert(schema.chapters).values({
					title,
					courseId,
					description,
					videoUrl,
					position,
					isPublished,
					isFree,
				})
			}
		}
		console.log("seeded chapters")
	} catch (error) {
		console.log("Error seeding the database chapters", error)
	}
}

export let seedMuxData = async () => {
	try {
		let chapters = await db.query.chapters.findMany()
		for (let chapter of chapters) {
			let assetId = "assetId"
			let playbackId = "playbackId"
			await db.insert(schema.muxData).values({
				chapterId: chapter.id,
				assetId,
				playbackId,
			})
		}
		console.log("seeded mux data")
	} catch (error) {
		console.log("Error seeding the database mux data", error)
	}
}

export let openFirstVideo = async () => {
	try {
		await db.update(schema.chapters).set({ isFree: true }).where(eq(schema.chapters.position, 1))
		console.log("opened first video")
	} catch (error) {
		console.log("Error opening the first video", error)
	}
}
