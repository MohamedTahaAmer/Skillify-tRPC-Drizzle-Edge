import { LogoSVG } from "@/components/SVGs/Logo"

export const Logo = () => {
	return (
		<div className="flex items-center justify-start gap-2">
			<LogoSVG className="w-12" />
			<p className="hidden text-2xl font-bold text-sky-800 md:block">Skillify</p>
		</div>
	)
}
