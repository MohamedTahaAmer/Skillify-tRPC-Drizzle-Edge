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
			<SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
				<Menu className="h-6 w-6" />
			</SheetTrigger>
			<SheetContent side="left" className="bg-white p-0">
				<SheetClose asChild>
					<Sidebar />
				</SheetClose>
			</SheetContent>
		</Sheet>
	)
}
