import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Logo } from "../logo"

const NavbarSkeleton = () => {
	return (
		<>
			<div className="flex h-full items-center border-b bg-white px-6 shadow-sm">
				<Link href="/" className="p-2">
					<Logo />
				</Link>
				<div className="ml-auto flex gap-x-2">
					<Skeleton className="h-10 w-20" />
				</div>
			</div>
		</>
	)
}

export default NavbarSkeleton
