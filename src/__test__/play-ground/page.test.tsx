import { expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import Page from "./Page"

test("Page", () => {
	render(<Page />)
	expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined()
	expect(screen.getByText(/Test/i)).toBeDefined()
	expect(screen.getByText(/Test/i).style).toHaveProperty("_values", {
		"accent-color": "ActiveBorder",
	})
	// expect(screen.getByRole("paragraph")).toBeDefined()
})
