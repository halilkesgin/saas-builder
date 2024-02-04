import { ReactNode } from "react"

import { Navbar } from "./_components/navbar"

interface SiteLayoutProps {
    children: ReactNode
}

const SiteLayout = ({
    children
}: SiteLayoutProps) => {
    return (
        <div className="h-full">
            <Navbar />
            {children}
        </div>
    )
}

export default SiteLayout
