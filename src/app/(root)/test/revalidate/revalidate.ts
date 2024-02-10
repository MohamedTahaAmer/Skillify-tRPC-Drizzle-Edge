"use server"

import { revalidatePath } from "next/cache"

export const revalidate = (path: string) => {
	console.log(path || "/")
	revalidatePath(path || "/")
}
