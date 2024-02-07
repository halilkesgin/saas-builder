"use client"

import { CustomModal } from "@/components/custom-modal"
import { useModal } from "@/components/providers/modal-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Agency, AgencySidebarOption, SubAccount, User } from "@prisma/client"
import { SubAccountDetails } from "../../../_components/sub-account-details"
import { PlusCircle } from "lucide-react"

interface CreateButtonProps {
    user: User & {
        Agency: Agency | null & {
            SubAccount: SubAccount[],
            SidebarOption: AgencySidebarOption
        } | null 
    }
    id: string
    className?: string
}

export const CreateButton = ({
    user,
    id,
    className
}: CreateButtonProps) => {
    const { setOpen } = useModal()

    const agencyDetails = user.Agency

    if (!agencyDetails) return


    return (
        <Button
            className={cn(
                "w-full flex gap-4",
                className
            )}
            onClick={() => {
                setOpen(
                    <CustomModal
                        title="Create Sub Account"
                        description="You can switch"
                    >
                        <SubAccountDetails 
                            agencyDetails={agencyDetails}
                            userId={user.id}
                            userName={user.name}
                        />
                    </CustomModal>
                )
            }}
        >
            <PlusCircle className="h-4 w-4" />
            Create Sub Account
        </Button>
    )
}