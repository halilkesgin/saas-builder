"use client"

import { useRouter } from "next/navigation"

import { deleteSubAccount, getSubAccountDetails, saveActivityLogsNotification } from "@/lib/queries"

interface DeleteButtonProps {
    subAccountId: string
}

export const DeleteButton = ({
    subAccountId
}: DeleteButtonProps) => {
    const router = useRouter()

    const onDelete = async () => {
        const response = await getSubAccountDetails(subAccountId)

        await saveActivityLogsNotification({
            agencyId: undefined,
            description: `Deleted a subaccount | ${response?.name}`,
            subAccountId: subAccountId
        })

        await deleteSubAccount(subAccountId)
        router.refresh()
    }

    return (
        <div onClick={onDelete}>
            Delete Sub Account
        </div>
    )
}