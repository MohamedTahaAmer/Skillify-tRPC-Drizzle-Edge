import Image from "next/image"
import ImageLogo from "@/public/logo.svg"
export const Logo = () => {
	// >(10-1-2024)
	// - hence this is a static image, I can leave the width and height to be the original size and set the display size via CSS on the parent element
	// but here I'm setting the width on the image itself
	//- and hence this is an svg not a png, Next.js cann't generate a base64dataURL for a blur placeholder
	// https://nextjs.org/docs/app/api-reference/components/image#placeholder
	return <Image width={130} alt="logo" src={ImageLogo} />
}
