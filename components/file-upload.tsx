"use client"

import toast from "react-hot-toast"

import { UploadDropzone } from "@/lib/uploadthing"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import { on } from "events"

interface FileUploadProps {
	onUploadComplete: (url?: string) => void
	on100percent?: (progress: number) => void
	endpoint: keyof typeof ourFileRouter
	className?: string
}

export const FileUpload = ({
	onUploadComplete,
	on100percent,
	endpoint,
	className
}: FileUploadProps) => {
	return (
		<UploadDropzone
			appearance={{
				button: { backgroundColor: "rgb(3 105 161)" },
				label: "text-sky-700",
				uploadIcon: "text-sky-700/50"
			}}
			className={className}
			endpoint={endpoint}
			// onUploadBegin={(all) => {
			// }}
			onUploadProgress={(progress) => {
				on100percent?.(progress)
			}}
			onClientUploadComplete={(res) => {
				onUploadComplete(res?.[0].url)
			}}
			onUploadError={(error: Error) => {
				toast.error(`${error?.message}`)
			}}
		/>
	)
}
