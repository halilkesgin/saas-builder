import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface PipelinesPageProps {
    params: { subAccountId: string }
}

const PipelinesPage = async ({
    params
}: PipelinesPageProps) => {

    const pipelineExist = await db.pipeline.findFirst({
        where: {
            subAccountId: params.subAccountId
        }
    })

    if (pipelineExist) {
        return redirect(`/sub-account/${params.subAccountId}/pipelines/${pipelineExist.id}`)
    }

    try {
        const response = await db.pipeline.create({
            data: {
                name: "First Pipeline",
                subAccountId: params.subAccountId
            }
        })

        return redirect(`/sub-account/${params.subAccountId}/pipelines/${response.id}`)
    } catch (error) {
        console.log(error)
    }

    return (
        <div>

        </div>
    )
}

export default PipelinesPage