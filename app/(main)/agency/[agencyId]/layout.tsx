import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

import { getNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries"
import { Blur } from "@/components/blur"

import { Sidebar } from "./_components/sidebar"
import { Navbar } from "./_components/navbar"

import UnauthorizedPage from "../unauthorized/page"

interface AgencyIdLayoutProps {
    children: ReactNode
    params: { agencyId: string }
}

const AgencyIdLayout = async ({
    children,
    params
}: AgencyIdLayoutProps) => {
    const agencyId = await verifyAndAcceptInvitation()
    const user = await currentUser()

    if (!user) {
        return redirect("/")
    }

    if (!agencyId) {
        return redirect("/agency")
    }

    if (user.privateMetadata.role !== "AGENCY_OWNER" && user.privateMetadata.role !== "AGENCY_ADMIN")

    return <UnauthorizedPage />

    let allNotifications: any = []

    const notifications = await getNotificationAndUser(agencyId)

    if (notifications) allNotifications = notifications
    
    return (
        <div className="h-screen ">
            <Sidebar 
                id={params.agencyId}
                type="agency"
            />
            <div className="md:pl-[300px]">
                <Navbar notifications={allNotifications} />
                <div className="relative">
                    <Blur>
                        {children}
                    </Blur>
                </div>
            </div>
        </div>
    )

}

export default AgencyIdLayout