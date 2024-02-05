"use client"

import { ReactNode } from "react"

import { useModal } from "./providers/modal-provider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"

interface CustomModalProps {
    title: string
    description: string
    children: ReactNode
    isDefaultOpen?: boolean
}

export const CustomModal = ({
    title,
    description,
    children,
    isDefaultOpen
}: CustomModalProps) => {

    const { isOpen, setClose } = useModal()

    return (
        <Dialog open={isOpen || isDefaultOpen} onOpenChange={setClose}>
            <DialogContent className="overflow-scroll md:max-h-[700px] md:h-fit h-screen bg-card">
                <DialogHeader className="pt-8 text-left">
                    <DialogTitle className="text-2xl font-bold">
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                    {children}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}