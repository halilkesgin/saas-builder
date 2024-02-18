import { notFound } from "next/navigation"

import { getDomainContent } from "@/lib/queries"
import { db } from "@/lib/db"
import EditorProvider from "@/components/providers/editor/editor-provider"
import { FunnelEditor } from "../(main)/sub-account/[subAccountId]/(routes)/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor"

interface DomainPageProps {
    params: {
        domain: string
    }
}

const DomainPage = async ({
    params
}: DomainPageProps) => {
    const domainData = await getDomainContent(params.domain.slice(0, -1))

    if (!domainData) return notFound()

    const pageData = domainData.FunnelPages.find((page) => !page.pathName)

    if (!pageData) return notFound()

    await db.funnelPage.update({
        where: {
            id: pageData.id
        },
        data: {
            visits: {
                increment: 1
            }
        }
    })

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

export default DomainPage