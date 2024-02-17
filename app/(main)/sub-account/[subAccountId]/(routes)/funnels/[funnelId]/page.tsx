import { Blur } from "@/components/blur"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFunnel } from "@/lib/queries"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FunnelSteps } from "./_components/funnel-steps"
import { FunnelSettings } from "./_components/funnel-settings"

interface Props {
    params: {
        funnelId: string
        subAccountId: string
    }
}

const FunnelIdPage = async ({
    params
}: Props) => {
    const funnel = await getFunnel(params.funnelId)

    if (!funnel) {
        return redirect(`/sub-account/${params.subAccountId}/funnels`)
    }

    return (
        <Blur>
            <Link
              href={`/sub-account/${params.subAccountId}/funnels`}
              className="flex justify-between gap-4 mb-4 text-muted-foreground"
            >
                Back
            </Link>
            <h1 className="text-3xl mb-8">{funnel.name}</h1>
            <Tabs
                defaultValue="steps"
                className="w-full"
            >
                <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
                    <TabsTrigger value="steps">Steps</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="steps">
                    <FunnelSteps
                        funnel={funnel}
                        subAccountId={params.subAccountId}
                        pages={funnel.FunnelPages}
                        funnelId={params.funnelId}
                    />
                </TabsContent>
                <TabsContent value="settings">
                    <FunnelSettings
                        subAccountId={params.subAccountId}
                        defaultData={funnel}
                    />
                </TabsContent>
            </Tabs>
        </Blur>
    )
}

export default FunnelIdPage