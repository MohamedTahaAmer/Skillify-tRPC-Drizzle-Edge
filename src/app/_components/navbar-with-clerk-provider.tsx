'use client'
import { ClerkProvider } from "@clerk/nextjs"
import { Navbar } from "./navbar"

const NavbarWithClerkProvider = () => {
	return (
		<ClerkProvider>
			<Navbar />
		</ClerkProvider>
	)
}

export default NavbarWithClerkProvider
