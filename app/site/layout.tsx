import React, { ReactNode } from "react"
import { dark } from "@clerk/themes"
import { ClerkProvider } from "@clerk/nextjs"

import { Navbar } from "./_components/navbar"

interface SiteLayoutProps {
    children: ReactNode
}

const SiteLayout = ({
    children
}: SiteLayoutProps) => {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            <main className="h-full">
                <Navbar />
                {children}
            </main>
        </ClerkProvider>
    )
}

export default SiteLayout
