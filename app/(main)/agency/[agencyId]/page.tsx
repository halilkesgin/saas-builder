import { CircleProgress } from "@/components/circle-progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { AreaChart } from "@tremor/react"
import { ClipboardIcon, Contact2, DollarSign, Goal, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface AgencyIdPageProps {
    params: { agencyId: string }
    searchParams: { code: string }
}

const AgencyIdPage = async ({
    params,
    searchParams
}: AgencyIdPageProps) => {
    let currency = "USD"
    let sessions
    let totalClosedSessions
    let totalPendingSessions
    let net = 0
    let potentialIncome = 0
    let closingRate = 0

    const currentYear = new Date().getFullYear()
    const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000
    const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000

    const agencyDetails = await db.agency.findUnique({
        where: {
            id: params.agencyId
        }
    })

    if (!agencyDetails) return

    const subAccounts = await db.subAccount.findMany({
        where: {
            agencyId: params.agencyId
        }
    })

    if (agencyDetails.connectAccountId) {
        const response = await stripe.accounts.retrieve({
            stripeAccount: agencyDetails.connectAccountId
        })

        currency = response.default_currency?.toUpperCase() || "USD"

        const checkoutSessions = await stripe.checkout.sessions.list({
            created: {
                gte: startDate,
                lte: endDate
            },
            limit: 100
        }, { stripeAccount: agencyDetails.connectAccountId })

        sessions = checkoutSessions.data
        
        totalClosedSessions = checkoutSessions.data.filter((session) => session.status === "complete").map((session) => ({
            ...session,
            created: new Date(session.created).toLocaleDateString(),
            amount_total: session.amount_total ? session.amount_total / 100 : 0 
        }))

        totalPendingSessions = checkoutSessions.data.filter((session) => session.status === "open").map((session) => ({
            ...session,
            created: new Date(session.created).toLocaleDateString(),
            amount_total: session.amount_total ? session.amount_total / 100 : 0 
        }))
        net = +totalClosedSessions
            .reduce((total, session) => total + (session.amount_total || 0), 0)
            .toFixed(2)

        potentialIncome = +totalPendingSessions
            .reduce((total, session) => total + (session.amount_total || 0), 0)
            .toFixed(2)

        closingRate = +(
            (totalClosedSessions.length / checkoutSessions.data.length) * 100
        ).toFixed(2)
    }

    return (
        <div className="relative h-full">
            {!agencyDetails.connectAccountId && (
                <div className="absolute -top-10 -left-10 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Connect your Stripe
                            </CardTitle>
                            <CardDescription>
                                You need to connect your stripe account to see metrics
                            </CardDescription>
                            <Link
                                href={`/agency/${agencyDetails.id}/launch-pad`}
                                className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
                            >
                                <ClipboardIcon className="h-4 w-4" />
                                Launch Pad
                            </Link>
                        </CardHeader>
                    </Card>
                </div>
            )}
            <h1 className="text-4xl">
                Dashboard
            </h1>
            <Separator className="my-5" />
            <div className="flex flex-col gap-4 pb-6">
                <div className="flex gap-4 flex-col xl:!flex-row">
                    <Card className="flex-1 relative">
                        <CardHeader>
                            <CardTitle className="text-4xl">
                                Income
                            </CardTitle>
                            <CardDescription>
                                {net ? `${currency} ${net.toFixed(2)}` : "$0.00"}
                            </CardDescription>
                            <small className="text-xs text-muted-foreground">
                                For the year {currentYear}
                            </small>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Total revenue generated as reflected in your stripe dashboard.
                        </CardContent>
                        <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
                    </Card>
                    <Card className="flex-1 relative">
                        <CardHeader>
                            <CardTitle>
                                Potential Income
                            </CardTitle>
                            <CardDescription>
                                {potentialIncome
                                    ? `${currency} ${potentialIncome.toFixed(2)}`
                                    : "$0.00"
                                }
                            </CardDescription>
                            <small className="text-sm text-muted-foreground">
                                This is how much you can close.
                            </small>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            This is how much you can close.
                        </CardContent>
                        <Contact2 className="absolute top-4 right-4 text-muted-foreground" />
                    </Card>
                    <Card className="flex-1 relative">
                        <CardHeader>
                            <CardTitle>
                                Active Clients
                            </CardTitle>
                            <CardDescription>
                                {subAccounts.length}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            Reflects the number of sub accounts you own and message
                        </CardContent>
                        <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
                    </Card>
                    <Card className="flex-1 relative">
                        <CardHeader>
                            <CardTitle>
                                Agency Goal
                            </CardTitle>
                            <CardDescription>
                                Reflects the number of you.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <div className="flex flex-col w-full">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        Current: {subAccounts.length}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        Goal: {agencyDetails.goal}
                                    </span>
                                </div>
                                <Progress 
                                    value={(subAccounts.length / agencyDetails.goal) * 100}
                                />
                            </div>
                        </CardFooter>
                        <Goal className="absolute right-4 top-4 text-muted-foreground" /> 
                    </Card>
                </div>
                <div className="flex gap-4 xl:!flex-row flex-col">
                    <Card className="p-4 flex-1">
                        <CardHeader>
                            <CardTitle>
                                Transaction History
                            </CardTitle>
                        </CardHeader>
                        <AreaChart 
                            className="text-sm stroke-primary"
                            data={[
                                ...(totalClosedSessions || []), 
                                ...(totalPendingSessions || [])
                            ]}
                            index="created"
                            categories={["amount_total"]}
                            colors={["primary"]}
                            yAxisWidth={30}
                            showAnimation={true}
                        />
                    </Card>
                    <Card className="xl:w-[400px] w-full">
                        <CardHeader>
                            <CardTitle>
                                Conversions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CircleProgress 
                                value={closingRate}
                                description={
                                    <>
                                        {sessions && (
                                            <div className="flex flex-col">
                                                Abandoned
                                                <div className="flex gap-2">
                                                    <ShoppingCart className="text-rose-700" />
                                                    {sessions.length}
                                                </div>
                                            </div>
                                        )}
                                        {totalClosedSessions && (
                                            <div className="flex flex-col">
                                                Won Carts
                                                <div className="flex gap-x-2">
                                                    <ShoppingCart className="text-emerald-700" />
                                                    {totalClosedSessions.length}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                }
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AgencyIdPage