import Image from "next/image"
import ImageLogo from "@/public/logo.svg"
export const Logo = () => {
	return <Image width={130} alt="logo" src={ImageLogo} />
}
