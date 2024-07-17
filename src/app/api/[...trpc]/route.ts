import { appRouter } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"
import { createOpenApiFetchHandler } from "trpc-swagger"

// Application Component || Define Handler
// =================================================================================================
// =================================================================================================
const handler = (req: Request) => {
	// Handle incoming swagger/openapi requests
	return createOpenApiFetchHandler({
		req,
		endpoint: "/api",
		router: appRouter,
		// createContext: () => { return {} },
		createContext: createTRPCContext,
	})
}
// Application Component || Define Exports
// =================================================================================================
// =================================================================================================
export { handler as GET, handler as POST }
