import { CourseProgress } from "@/components/course-progress"
import { render } from "@testing-library/react"
import { describe, expect, test } from "vitest"

describe("CourseProgress", () => {
	test("renders the progress bar with the correct value", () => {
		let value = 50
		let courseProgress = render(<CourseProgress value={value} />)
		let regex = new RegExp(`${value}% Complete`, "i")
		expect(courseProgress.getByText(regex)).toBeDefined()

		let progressBar = courseProgress.getByRole("progressbar")
		let firstChild = progressBar.firstChild as HTMLElement
		expect(firstChild.style).toHaveProperty("_values", {
			transform: `translateX(-${value}%)`,
		})
		courseProgress.unmount()
	})

	test("renders the progress bar with the correct variant", () => {
		let value = 50
		let courseProgress = render(
			<CourseProgress value={value} variant="success" />,
		)

		let progressBar = courseProgress.getByRole("progressbar")
		let firstChild = progressBar.firstChild as HTMLElement
		expect(firstChild.classList).toContain("bg-emerald-700")
		courseProgress.unmount()
	})

	test("renders the progress bar with the correct size", () => {
		let value = 50
		let courseProgress = render(
			<CourseProgress variant="success" size="sm" value={value} />,
		)

		let text = courseProgress.getByText(`${value}% Complete`)
		expect(text).toBeDefined()
		expect(text.classList).toContain("text-xs")
		courseProgress.unmount()
	})
})
