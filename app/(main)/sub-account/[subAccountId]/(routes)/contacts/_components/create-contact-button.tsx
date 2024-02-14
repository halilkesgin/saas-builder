"use client"

import { CustomModal } from "@/components/custom-modal"
import { useModal } from "@/components/providers/modal-provider"
import { Button } from "@/components/ui/button"
import { ContactForm } from "./contact-form"

interface CreateContactButtonProps {
    subAccountId: string
}

export const CreateContactButton = ({
    subAccountId
}: CreateContactButtonProps) => {
    const { setOpen } = useModal()

    const handleCreateContact = async () => {
        setOpen(
            <CustomModal
                title="Create or update contact information"
                description=""
            >
                <ContactForm subAccountId={subAccountId} />
            </CustomModal>
        )
    }

    return (
        <Button
            onClick={handleCreateContact}
        >   
            Create Contact
        </Button>
    )
}