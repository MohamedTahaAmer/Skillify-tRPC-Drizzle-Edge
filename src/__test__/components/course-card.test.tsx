import { CourseCard } from "@/components/course-card"
import { formatPrice } from "@/lib/format"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
let course: {
	id: string
	title: string
	imageUrl: string
	chaptersLength: number
	price: number
	category: string
	progress?: number
} = {
	id: "1",
	title: "JavaScript Fundamentals",
	imageUrl: "https://example.com/image.jpg",
	chaptersLength: 20,
	price: 19.99,
	category: "Web Development",
}

describe("CourseCard component", () => {
	it("renders the card with basic information", () => {
		let courseCard = render(<CourseCard {...course} />)

		// test that the course card has an img with alt text of the course title
		expect(courseCard.getByAltText(course.title)).toBeDefined()
		expect(screen.getByText(course.title)).toBeDefined()
		expect(screen.getByText(course.category)).toBeDefined()
		expect(screen.getByText("20 Chapters")).toBeDefined()
		expect(screen.getByText("$19.99")).toBeDefined()
		screen.debug()
		expect(screen.queryByText(/ % Complete/i)).toBeNull()
		courseCard.unmount()
	})

	it("renders the price for courses without progress", () => {
		course = { ...course, progress: undefined }
		let courseCard = render(<CourseCard {...course} />)
		expect(screen.getByText(formatPrice(course.price))).toBeDefined()
		courseCard.unmount()
	})

	it("renders the course progress for courses with progress", () => {
		course = { ...course, progress: 50 }
		let courseCard = render(<CourseCard {...course} />)
		screen.debug()

		expect(screen.getByText(/50% Complete/i)).toBeDefined()
		courseCard.unmount()
	})

	it("navigates to the course page when clicked", async () => {
		let courseCard = render(<CourseCard {...course} />)
		expect(courseCard.getByRole("link")).toHaveAttribute(
			"href",
			`/courses/${course.id}`,
		)
	})
})
