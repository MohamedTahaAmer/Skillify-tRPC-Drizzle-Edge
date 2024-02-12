export function logTime({
	title,
	startTime,
}: {
	title: string
	startTime: number
}) {
	console.log("\x1b[33m%s\x1b[0m", `⏱ - ${title}:`, Date.now() - startTime)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logObjSize({ title, obj }: { obj: any; title: string }) {
	// Convert the object to a JSON string
	const jsonString = JSON.stringify(obj)

	// Get the length of the JSON string
	const dataSizeInBytes = new TextEncoder().encode(jsonString).length

	console.log("\x1b[33m%s\x1b[0m", `📦 - ${title}:`, dataSizeInBytes, "bytes")
}
