"use client"

import { intl } from "@/config/intl"
import { Link, usePathname } from "@/lib/navigation"
import { useLocale } from "next-intl"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { ChevronDown } from "lucide-react"

const LocaleDropDown = () => {

	const pathname = usePathname()
	const locale = useLocale()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className="flex items-center gap-2 h-9 px-3">
					<Image src={`/imgs/${locale}.svg`} width={23} height={23} alt={locale} />
					<ChevronDown className="size-4 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{intl.localeList.map(data => (
					<DropdownMenuItem key={data.locale} asChild>
						<Link href={pathname}
							locale={data.locale}
							className="flex items-center gap-2 w-full"
						>
							<Image src={`/imgs/${data.locale}.svg`} width={23} height={23} alt={data.locale} />
							<span>
								{data.label}
							</span>
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default LocaleDropDown