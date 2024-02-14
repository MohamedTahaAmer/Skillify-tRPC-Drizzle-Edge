import { expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import { CourseProgress } from "@/components/course-progress"

test("CourseProgress", () => {
	render(<CourseProgress value={50} />)
	expect(screen.getByText(/50/i)).toBeDefined()
})
