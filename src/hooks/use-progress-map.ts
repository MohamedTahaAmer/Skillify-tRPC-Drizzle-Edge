import { create } from "zustand"

type ProgressMap = Record<string, number> | undefined

type ProgressMapStore = {
	progressMap: ProgressMap
	setProgressMap: (progressMap: ProgressMap) => void
}

export const useProgressMap = create<ProgressMapStore>((set) => ({
	progressMap: undefined,
	setProgressMap: (progressMap: ProgressMap) => set({ progressMap }),
}))
