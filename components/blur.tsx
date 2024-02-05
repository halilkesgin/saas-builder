import { ReactNode } from "react"

interface BlurProps {
    children: ReactNode
}

export const Blur = ({
    children
}: BlurProps) => {
    return (
        <div className="h-screen backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black mx-auto pt-24 p-4 absolute top-0 right-0 left-0 bottom-0 z-[11]">
            {children}
        </div>
    )
}