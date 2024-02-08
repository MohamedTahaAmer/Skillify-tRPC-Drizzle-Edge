export function logTime({
	title,
	startTime,
}: {
	title: string
	startTime: number
}) {
	console.log("\x1b[33m%s\x1b[0m", `⏱ ${title}:`, Date.now() - startTime)
}
