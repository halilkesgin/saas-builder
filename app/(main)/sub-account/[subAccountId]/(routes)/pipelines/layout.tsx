import { Blur } from "@/components/blur"
import { ReactNode } from "react"

interface PipelinesLayoutProps {
    children: ReactNode
}

const PipelinesLayout = ({
    children
}: PipelinesLayoutProps) => {
    return (
        <Blur>
            {children}
        </Blur>
    )
}

export default PipelinesLayout