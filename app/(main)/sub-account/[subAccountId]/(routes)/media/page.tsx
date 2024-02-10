import { Blur } from "@/components/blur"
import { Media } from "@/components/media"
import { getMedia } from "@/lib/queries"

interface MediaPageProps {
    params: { subAccountId: string }
}

const MediaPage = async ({
    params
}: MediaPageProps) => {
    const data = await getMedia(params.subAccountId)

    return (
        <Blur>
            <Media 
                data={data}
                subAccountId={params.subAccountId}
            />
        </Blur>
    )
}

export default MediaPage