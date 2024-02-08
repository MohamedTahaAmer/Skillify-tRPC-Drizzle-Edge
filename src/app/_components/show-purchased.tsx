"use client"

import { useUser } from "@/hooks/useUser"
import Purchased from "./purchased"

const ShowPurchased = () => {
	let { user } = useUser()
	let userId = user?.id
	return <>{userId && <Purchased />}</>
}

export default ShowPurchased
