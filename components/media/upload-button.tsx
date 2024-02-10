"use client"

import { CustomModal } from "../custom-modal"
import { useModal } from "../providers/modal-provider"
import { Button } from "../ui/button"
import { MediaForm } from "./media-form"

interface UploadButtonProps {
    subAccountId: string
}

export const UploadButton = ({
    subAccountId
}: UploadButtonProps) => {
    const { isOpen, setOpen, setClose } = useModal()

    return (
        <Button
            onClick={() => {
                setOpen(
                    <CustomModal
                        title="Upload Media"
                        description="Upload a file to your media bucket"
                    >
                        <MediaForm 
                            subAccountId={subAccountId}
                        />
                    </CustomModal>
                )
            }}
        >
            Upload
        </Button>
    )
}