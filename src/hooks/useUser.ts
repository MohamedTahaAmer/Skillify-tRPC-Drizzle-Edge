import { create } from "zustand"
import type { UserResource } from "@clerk/types"

type User = UserResource | null | undefined

type UserStore = {
	user: User
	setUser: (user: User) => void
}

export const useUser = create<UserStore>((set) => ({
	user: null,
	setUser: (user: User) => set({ user }),
}))
