import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import React, { ReactNode } from "react"

interface MainLayoutProps {
    children: ReactNode
}

const MainLayout = ({
    children
}: MainLayoutProps) => {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            {children}
        </ClerkProvider>
    )
}

export default MainLayout