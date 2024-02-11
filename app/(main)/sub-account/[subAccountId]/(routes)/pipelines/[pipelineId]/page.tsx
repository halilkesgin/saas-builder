import { Tabs, TabsList } from "@/components/ui/tabs"
import { db } from "@/lib/db"
import { getLanesWithTicketAndTags, getPipelineDetails } from "@/lib/queries"
import { LaneDetail } from "@/lib/types"
import { redirect } from "next/navigation"
import { PipelineInfoBar } from "./_components/pipeline-info-bar"

interface PipelineIdPageProps {
    params: { subAccountId: string, pipelineId: string }
}

const PipelineIdPage = async ({
    params
}: PipelineIdPageProps) => {
    const pipelineDetails = await getPipelineDetails(params.pipelineId)

    if (!pipelineDetails) {
        return redirect(`/sub-account/${params.subAccountId}/pipelines`)
    }

    const pipelines = await db.pipeline.findMany({
        where: {
            subAccountId: params.subAccountId
        }
    })

    const lanes = (await getLanesWithTicketAndTags(
        params.pipelineId
    )) as LaneDetail[]

    return (
        <Tabs
            defaultValue="view"
            className="w-full"
        >
            <TabsList
                className="bg-transparent border-b-2 h-16 w-full justify-between mb-4"
            >
                <PipelineInfoBar
                    pipelineId={params.pipelineId}
                    subAccountId={params.subAccountId}
                    pipelines={pipelines}
                />
            </TabsList>
        </Tabs>
    )
}

export default PipelineIdPage