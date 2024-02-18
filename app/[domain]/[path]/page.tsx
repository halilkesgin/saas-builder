import { FunnelEditor } from "@/app/(main)/sub-account/[subAccountId]/(routes)/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor"
import EditorProvider from "@/components/providers/editor/editor-provider"
import { getDomainContent } from "@/lib/queries"
import { notFound } from "next/navigation"

interface PathPageProps {
    params: {
        domain: string
        path: string
    }
}

const PathPage = async ({
    params
}: PathPageProps) => {
    const domainData = await getDomainContent(params.domain.slice(0, -1))

    const pageData = domainData?.FunnelPages.find((page) => page.pathName === params.path)

    if (!pageData || !domainData) return notFound()

    return (
        <EditorProvider
            subAccountId={domainData.subAccountId}
            pageDetails={pageData}
            funnelId={domainData.id}
        >
            <FunnelEditor 
                funnelPageId={pageData.id}
                liveMode={true}
            />
        </EditorProvider>
    )
}

export default PathPage