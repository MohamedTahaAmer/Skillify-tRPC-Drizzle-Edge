import { LogoSVG } from "@/components/SVGs/Logo"

export const Logo = () => {
	return (
		<div className="flex items-center justify-start gap-2">
			{/* <Image width={40} alt="logo" src={ImageLogo} /> */}
			<LogoSVG className="w-12" />
			<p className="text-2xl font-bold text-sky-800">Skillify</p>
		</div>
	)
}
