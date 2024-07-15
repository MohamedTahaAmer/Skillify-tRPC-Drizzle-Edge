import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware((auth, req) => {
	console.log("\x1b[1;33m%s\x1b[1;36m", req.url)
	// auth().protect()
})
export const config = {
	matcher: [
		"/((?!.*\\..*|_next).*)",
		"/",
		"/(api|trpc)(.*)",
		// "^(?!/api/uploadthing).*$",
		// "^(?!/api/webhook).*$",
		// "^(?!/api/courses).*$",
		// "^(?!/api/test).*$",
		// "^(?!/api/trpc).*$",
		// "/.*",
	],
}

/*
Clerk has changes their middleware protection: https://clerk.com/docs/references/nextjs/clerk-middleware#create-route-matcher
in here 

1- if the request made it to the middleware, what to protect
export default clerkMiddleware() alone will allow all the routes to go through 'unprotected' state
- here we are protecting all the routes that make it to the middleware
export default clerkMiddleware((auth, req) => {
	auth().protect()
}) will protect all the routes

2- what routes make it to the middleware
- the config object matcher property is used to define what routes make it to the middleware
	https://clerk.com/docs/references/nextjs/clerk-middleware#create-route-matcher
and we are using negative lookahead regex to exclude the routes we don't want to protect
and the last element in the array is a catch all to protect all the routes that are not excluded
*/
