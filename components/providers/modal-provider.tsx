"use client"

import { TicketDetails } from "@/lib/types"
import { Agency, User } from "@prisma/client"
import React, { useContext, useEffect, useState } from "react"
import { ReactNode, createContext } from "react"

interface ModalProviderProps {
    children: ReactNode
}

export type ModalData = {
    user?: User
    agency?: Agency
    ticket?: TicketDetails[0]
}

type ModalContextType = {
    data: ModalData
    isOpen: boolean
    setOpen: (modal: ReactNode, fetchData?: () => Promise<any>) => void
    setClose: () => void
}

export const ModalContext = createContext<ModalContextType>({
    data: {},
    isOpen: false,
    setOpen: (modal: ReactNode, fetchData?: () => Promise<any>) => {} ,
    setClose: () => {}
})

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<ModalData>({})
    const [showModal, setShowModal] = useState<ReactNode>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const setOpen = async (modal: ReactNode, fetchData?: () => Promise<any>) => {
        if (modal) {
            if (fetchData) {
                setData({ ...data, ...(await fetchData())} || {})
            }
            setShowModal(modal)
            setIsOpen(true)
        }
    }

    const setClose = () => {
        setIsOpen(false)
        setData({})
    }

    if (!isMounted) return null

    return (
        <ModalContext.Provider
            value={{ data, setOpen, setClose, isOpen }}
        >
            {children}
            {showModal}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext)

    if (!context) {
        throw new Error("useModal must be used within the modal provider")
    }

    return context
}

export default ModalProvider