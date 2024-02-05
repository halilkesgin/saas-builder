import { getNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import UnauthorizedPage from "../unauthorized/page"
import { Sidebar } from "./_components/sidebar"

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
        <div className="h-screen overflow-hidden">
            <Sidebar 
                id={params.agencyId}
                type="agency"
            />
            <div className="md:pl-[300px]">
                {children}
            </div>
        </div>
    )

}

export default AgencyIdLayout