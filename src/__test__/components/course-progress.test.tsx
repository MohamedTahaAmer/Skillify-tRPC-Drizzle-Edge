import { CourseProgress } from "@/components/course-progress"
import { render } from "@testing-library/react"
import { describe, expect, test } from "vitest"

describe("CourseProgress", () => {
	test("renders the progress bar with the correct value", () => {
		let value = 40
		let courseProgress = render(<CourseProgress value={value} />)
		let regex = new RegExp(`${value}% Complete`, "i")
		expect(courseProgress.getByText(regex)).toBeVisible()

		expect(courseProgress.getByRole("progressbar").firstChild).toHaveStyle(
			`transform: translateX(-${100 - value}%);`,
		)
		courseProgress.unmount()
	})

	test("renders the progress bar with the correct variant", () => {
		let value = 50
		let courseProgress = render(
			<CourseProgress value={value} variant="success" />,
		)

		expect(courseProgress.getByRole("progressbar").firstChild).toHaveClass(
			"bg-emerald-700",
		)
		courseProgress.unmount()
	})

	test("renders the progress bar with the correct size", () => {
		let value = 50
		let courseProgress = render(
			<CourseProgress variant="success" size="sm" value={value} />,
		)

		expect(courseProgress.getByText(`${value}% Complete`)).toHaveClass(
			"text-xs",
		)
		courseProgress.unmount()
	})
})
