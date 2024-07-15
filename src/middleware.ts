import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/api/webhook",
	"/api/uploadthing",
	"/",
	"/courses/:path*",
	"/test/:path*",
	"/r-test/:path*",

	// - here we are running the middleware on all of the backend trpc routs, even though not all the routes are protected, this will add unnecessary cost of calling vercel's edge middleware without needing them on public trpc routes
	"/api/trpc/:path*",
])

export default clerkMiddleware((auth, request) => {
	if (!isPublicRoute(request)) {
		auth().protect()
	}
})

export const config = {
	// - here the first elements prevents the middleware from running on any route with . in it, and our trpc endpoints all have . in them, so that we need the third element to allow the middle ware to run on any route with trpc even if it has a . in it
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
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
