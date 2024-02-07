import { db } from "@/lib/db"
import DataTable from "./_components/data-table"
import { Plus } from "lucide-react"
import { currentUser } from "@clerk/nextjs"
import { columns } from "./_components/columns"
import { SendInvitation } from "./_components/send-invitation"

interface TeamPageProps {
    params: { agencyId: string }
}

const TeamPage = async ({
    params
}: TeamPageProps) => {
    const authUser = await currentUser()

    const teamMembers = await db.user.findMany({
        where: {
            Agency: {
                id: params.agencyId
            }
        },
        include: {
            Agency: {
                include: {
                    SubAccount: true
                }
            },
            Permissions: {
                include: {
                    SubAccount: true
                }
            }
        }
    })

    if (!authUser) return null

    const agencyDetails = await db.agency.findUnique({
        where: {
            id: params.agencyId
        },
        include: {
            SubAccount: true
        }
    })

    if (!agencyDetails) return null

    return (
        <DataTable
            actionButtonText={
                <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                </>
            }
            modalChildren={
                <>
                    <SendInvitation 
                        agencyId={agencyDetails.id}
                    />
                </>
            }
            filterValue="name"
            columns={columns}
            data={teamMembers}

        >

        </DataTable>
    )
}

export default TeamPage