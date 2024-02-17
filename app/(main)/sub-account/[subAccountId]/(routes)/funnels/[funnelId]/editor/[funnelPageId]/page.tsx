import EditorProvider from "@/components/providers/editor/editor-provider"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { FunnelEditorNav } from "./_components/funnel-editor-nav"
import { FunnelEditorSidebar } from "./_components/funnel-editor-sidebar"
import { FunnelEditor } from "./_components/funnel-editor"

interface Props {
    params: {
        subAccountId: string
        funnelId: string
        funnelPageId: string
    }
}

const Page = async ({
    params
}: Props) => {

    const funnelPageDetails = await db.funnelPage.findFirst({
        where: {
            id: params.funnelPageId
        }
    })

    if (!funnelPageDetails) {
        return redirect(`/sub-account/${params.subAccountId}/funnels/${params.funnelId}`)
    }

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
            <EditorProvider
                subAccountId={params.subAccountId}
                funnelId={params.funnelId}
                pageDetails={funnelPageDetails}
            >
                <FunnelEditorNav 
                    subAccountId={params.subAccountId}
                    funnelPageDetails={funnelPageDetails}
                    funnelId={params.funnelId}
                />
                <div className="h-full flex justify-center">
                    <FunnelEditor 
                        funnelPageId={params.funnelPageId}
                    />
                </div>
                <FunnelEditorSidebar 
                    subAccountId={params.subAccountId}
                />
            </EditorProvider>
        </div>
    )
}

export default Page