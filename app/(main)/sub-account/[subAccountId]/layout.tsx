import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"
import { Role } from "@prisma/client"

import { Unauthorized } from "@/components/unauthorized"
import { 
    getAuthUserDetails, 
    getNotificationAndUser, 
    verifyAndAcceptInvitation 
} from "@/lib/queries"

import { Navbar } from "../../agency/[agencyId]/_components/navbar"
import { Sidebar } from "../../agency/[agencyId]/_components/sidebar"

interface SubAccountIdLayoutProps {
    children: ReactNode
    params: { subAccountId: string }
}

const SubAccountIdLayout = async ({
    children,
    params
}: SubAccountIdLayoutProps) => {
    const agencyId = await verifyAndAcceptInvitation()

    if (!agencyId) return <Unauthorized />

    const user = await currentUser()

    if (!user) {
        return redirect("/")
    }

    let notifications: any = []

    if (!user.privateMetadata.role) {
        return <Unauthorized />
    } else {
        const allPermissions = await getAuthUserDetails()
        const hasPermission = allPermissions?.Permissions.find(
            (permission) => permission.access && permission.subAccountId === params.subAccountId
        )

        if (!hasPermission) {
            return <Unauthorized />
        }

        const allNotifications = await getNotificationAndUser(agencyId)

        if (
            user.privateMetadata.role === "AGENCY_ADMIN" ||
            user.privateMetadata.role === "AGENCY_OWNER"
        ) {
            const filteredNotification = allNotifications?.filter(
                (item) => item.subAccountId === params.subAccountId
            )

            if (filteredNotification) notifications = filteredNotification
        }
    }

    return (
        <div className="h-screen overflow-hidden">
            <Sidebar 
                id={params.subAccountId}
                type="subAccount"
            />
            <div className="md:pl-[300px]">
                <Navbar 
                    notifications={notifications}
                    role={user.privateMetadata.role as Role}
                    subAccountId={params.subAccountId as string}
                />
                <div className="relative">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SubAccountIdLayout