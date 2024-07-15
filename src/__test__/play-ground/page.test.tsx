import { expect, test, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import Page from "./Page"

vi.mock("next/navigation", () => {
	const params: Map<string, string | number> = new Map<string, string | number>([
		["foo", "bar"],
		["baz", 42],
	])

	return {
		useSearchParams: () => params,
	}
})

test("Page", () => {
	render(<Page />)
	expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined()
	expect(screen.getByText(/Test/i)).toBeDefined()
	expect(screen.getByText(/Test/i).style).toHaveProperty("_values", {
		"accent-color": "ActiveBorder",
	})
	// expect(screen.getByRole("paragraph")).toBeDefined()
})
