"use client"

import { useSearchParams } from "next/navigation"

export default function Page() {
	let paramsObj = Object.fromEntries(useSearchParams().entries())

	return (
		<div>
			<h1>Home</h1>
			<h1>{JSON.stringify(paramsObj)}</h1>
			<p style={{ accentColor: "ActiveBorder" }}>Test</p>
		</div>
	)
}
