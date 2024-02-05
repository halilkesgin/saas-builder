import { getAuthUserDetails } from "@/lib/queries"

import { MenuOptions } from "./menu-options"

interface SidebarProps {
    id: string
    type: "agency" | "subaccount"
}

export const Sidebar = async ({
    id,
    type
}: SidebarProps) => {

    const user = await getAuthUserDetails()

    if (!user) return null

    if (!user.Agency) return

    const details = type === "agency" ? user?.Agency : user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)

    const isWhiteLabeledAgency = user.Agency.whiteLabel

    if (!details) return

    let sidebarLogo = "/assets/plura-logo.svg"

    if (!isWhiteLabeledAgency) {
        if (type === "subaccount") {
            sidebarLogo = user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)?.subAccountLogo || ""
        }
    }

    const sidebarOptions = type === "agency" ? user.Agency.SidebarOption || [] : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)?.SidebarOption || []

    const subAccounts = user.Agency.SubAccount.filter((subaccount) => user.Permissions.find((permission) => permission.subAccountId === subaccount.id && permission.access))

    return (
        <>
            <MenuOptions 
                defaultOpen={true}
                subAccounts={subAccounts}
                sidebarOptions={sidebarOptions}
                sidebarLogo={sidebarLogo}
                details={details}
                user={user}
                id={id}
            />
            <MenuOptions 
                subAccounts={subAccounts}
                sidebarOptions={sidebarOptions}
                sidebarLogo={sidebarLogo}
                details={details}
                user={user}
                id={id}
            />
            
        </>
    )
}