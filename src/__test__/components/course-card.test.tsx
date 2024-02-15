import { CourseCard } from "@/components/course-card"
import { formatPrice } from "@/lib/format"
import { render } from "@testing-library/react"
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

		expect(courseCard.getByRole("img")).toHaveAttribute("alt", course.title)
		expect(courseCard.getByText(course.title)).toBeVisible()
		expect(courseCard.getByText(course.category)).toBeVisible()
		expect(courseCard.getByText("20 Chapters")).toBeVisible()
		expect(courseCard.getByText("$19.99")).toBeVisible()
		expect(courseCard.queryByText(/ % Complete/i)).toBeNull()
		courseCard.unmount()
	})

	it("renders the price for courses without progress", () => {
		course = { ...course, progress: undefined }
		let courseCard = render(<CourseCard {...course} />)
		expect(courseCard.getByText(formatPrice(course.price))).toBeVisible()
		courseCard.unmount()
	})

	it("renders the course progress for courses with progress", () => {
		course = { ...course, progress: 50 }
		let courseCard = render(<CourseCard {...course} />)
		expect(courseCard.getByText(/50% Complete/i)).toBeVisible()
		courseCard.unmount()
	})

	it("navigates to the course page when clicked", () => {
		let courseCard = render(<CourseCard {...course} />)
		expect(courseCard.getByRole("link")).toHaveAttribute(
			"href",
			`/courses/${course.id}`,
		)
	})
})
