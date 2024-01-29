import { PrismaClient } from "@prisma/client"
import { env } from "@/env"

declare global {
	// eslint-disable-next-line
	var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma ?? new PrismaClient()

if (env.NODE_ENV !== "production") globalThis.prisma = db