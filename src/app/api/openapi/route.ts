import { openApiDocument } from "@/server/api/openapi"
import { NextResponse } from "next/server"

// // Application Component || Define Exports
// // =================================================================================================
// // =================================================================================================
export async function GET() {
	console.log("\x1b[1;31m%s\x1b[1;36m", "GET /api/openapi")
	return NextResponse.json(openApiDocument)
}
