import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/db"
import { getLanesWithTicketAndTags, getPipelineDetails, updateLanesOrder, updateTicketOrder } from "@/lib/queries"
import { LaneDetail } from "@/lib/types"
import { redirect } from "next/navigation"
import { PipelineInfoBar } from "./_components/pipeline-info-bar"
import { PipelineSettings } from "./_components/pipeline-settings"
import { PipelineView } from "./_components/pipeline-view"

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
                <div>
                    <TabsTrigger value="view">
                        Pipeline View
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                        Settings
                    </TabsTrigger>
                </div>
            </TabsList>
            <TabsContent value="view">
                <PipelineView 
                    lanes={lanes}
                    pipelineDetails={pipelineDetails}
                    pipelineId={params.pipelineId}
                    subAccountId={params.subAccountId}
                    updateLanesOrder={updateLanesOrder}
                    updateTicketOrder={updateTicketOrder}
                />
            </TabsContent>
            <TabsContent value="settings">
                <PipelineSettings 
                    pipelineId={params.pipelineId}
                    pipelines={pipelines}
                    subAccountId={params.subAccountId}
                />
            </TabsContent>
        </Tabs>
    )
}

export default PipelineIdPage