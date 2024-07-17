import "server-only"

import { createTRPCProxyClient, loggerLink, TRPCClientError } from "@trpc/client"
import { callProcedure } from "@trpc/server"
import { observable } from "@trpc/server/observable"
import { type TRPCErrorResponse } from "@trpc/server/rpc"
import { headers } from "next/headers"
import { cache } from "react"

import { appRouter, type AppRouter } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"
import { transformer } from "./shared"

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
	const heads = new Headers(headers())
	heads.set("x-trpc-source", "rsc")

	return createTRPCContext({
		// @ts-expect-error - we don't need to pass the request
		req: { headers: heads },
	})
})
// - here in T3 stack they are using a vanilla tRPC client, that should be used by
// 1- a client side code in a framework that doesn't have a tRPC official client like react has react-query integration
// 2- TS server side code that lives in another server, and will make an typesafe http request to this server
// generally, you will provide this vanilla client with a url 'http link' for it to listen to incoming http requests on that url
// but here we a custom link that will call our procedures directly, and we don't need to make an http request to the server
// why not using createCallerFactory? will it make an http request to the server? although it's made specifically for server side calls from the same server
export const api = createTRPCProxyClient<AppRouter>({
	transformer,
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
		}),
		/**
		 * Custom RSC link that lets us invoke procedures without using http requests. Since Server
		 * Components always run on the server, we can just call the procedure as a function.
		 */
		() =>
			({ op }) =>
				// all custom links must return an observable
				observable((observer) => {
					createContext()
						.then((ctx) => {
							return callProcedure({
								procedures: appRouter._def.procedures,
								path: op.path,
								rawInput: op.input,
								ctx,
								type: op.type,
							})
						})
						.then((data) => {
							observer.next({ result: { data } })
							observer.complete()
						})
						.catch((cause: TRPCErrorResponse) => {
							observer.error(TRPCClientError.from(cause))
						})
				}),
	],
})
