import { Banner } from "@/components/banner"
import { render } from "@testing-library/react"
import { describe, expect, test } from "vitest"

describe("Banner", () => {
	test("renders the banner with the correct label", () => {
		let label = "Welcome to the course"
		let banner = render(<Banner label={label} />)
		expect(banner.getByText(label)).toBeVisible()
		banner.unmount()
	})
	test("renders the banner with the correct variant", () => {
		let label = "Welcome to the course"
		let banner = render(<Banner label={label} variant="success" />)
		expect(banner.getByText(label)).toHaveClass("bg-emerald-700")
		banner.unmount()
	})
})
