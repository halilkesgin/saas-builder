import { Blur } from "@/components/blur"
import { getFunnels } from "@/lib/queries"
import { Plus } from "lucide-react"
import { columns } from "./_components/columns"
import FunnelsDataTable from "./_components/data-table"
import { FunnelForm } from "./_components/funnel-form"

interface FunnelsPageProps {
    params: {
        subAccountId: string
    }
}

const FunnelsPage = async ({
    params
}: FunnelsPageProps) => {
    const funnels = await getFunnels(params.subAccountId)

    if (!funnels) return null

    return (
        <Blur>
            <FunnelsDataTable 
                actionButtonText={
                    <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create funnel
                    </>
                }
                modalChildren={
                    <FunnelForm subAccountId={params.subAccountId} />
                }
                filterValue="name"
                columns={columns}
                data={funnels}
            />
        </Blur>
    )
}

export default FunnelsPage