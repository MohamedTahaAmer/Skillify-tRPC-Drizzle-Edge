import { Menu } from "lucide-react"

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger
} from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"

export const MobileSidebar = () => {
	return (
		<Sheet>
			{/* // >(9-1-2024:2)  */}
			{/* <SheetTrigger asChild className="md:hidden pr-4 hover:opacity-75 transition"> */}
			<SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
				<Menu className="w-6 h-6" />
			</SheetTrigger>
			<SheetContent side="left" className="p-0 bg-white">
				<SheetClose asChild>
					<Sidebar />
				</SheetClose>
			</SheetContent>
		</Sheet>
	)
}
