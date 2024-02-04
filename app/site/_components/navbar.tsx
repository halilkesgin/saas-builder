import Image from "next/image"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

import { ModeToggle } from "@/components/mode-toggle"

interface NavbarProps {
    user?: User | null
}

export const Navbar = ({
    user
}: NavbarProps) => {
    return (
        <div className="sticky top-0 p-4 flex items-center justify-between z-10 bg-white dark:bg-background">
            <aside className="flex items-center gap-2">
                <Image
                    src="/assets/plura-logo.svg"
                    width={40}
                    height={40}
                    alt="Logo"
                />
                <span className="text-xl font-bold">
                    SaaS Builder
                </span>
            </aside>
            <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] z-50">
                <ul className="flex items-center justify-center gap-8">
                    <Link
                        href="#"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="#"
                    >
                        About
                    </Link>
                    <Link
                        href="#"
                    >
                        Documentation
                    </Link>
                    <Link
                        href="#"
                    >
                        Features
                    </Link>
                </ul>
            </nav>
            <aside className="flex gap-2 items-center">
                <Link
                    href="/agency"
                    className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80 transition"
                >
                    Login
                </Link>
                <UserButton />
                <ModeToggle />
            </aside>
        </div>
    )
}
