import { Separator } from "@/components/ui/separator"
import { addOnProducts, pricingCards } from "@/lib/constants"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { PricingCard } from "./_components/pricing-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface BillingPageProps {
    params: { agencyId: string }
}

const BillingPage = async ({
    params
}: BillingPageProps) => {
    const addOns = await stripe.products.list({
        ids: addOnProducts.map((product) => product.id),
        expand: ["data.default_price"]
    })

    const agencySubscription = await db.agency.findUnique({
        where: {
            id: params.agencyId
        },
        select: {
            customerId: true,
            Subscription: true
        }
    })

    const prices = await stripe.prices.list({
        product: process.env.NEXT_PLURA_PRODUCT_ID,
        active: true
    })

    const currentPlanDetails = pricingCards.find(
        (c) => c.priceId === agencySubscription?.Subscription?.priceId
    )

    const charges = await stripe.charges.list({
        limit: 50,
        customer: agencySubscription?.customerId
    })
    
    const allCharges = [
        ...charges.data.map((charge) => ({
            id: charge.id,
            description: charge.description,
            date: `${new Date(charge.created * 1000).toLocaleTimeString()} ${new Date(charge.created * 1000).toLocaleTimeString()}`,
            status: "Paid",
            amount: `$${charge.amount / 100}`
        }))
    ]

    return (
        <>
            <h1 className="text-4xl p-4">
                Billing
            </h1>
            <Separator />
            <h2 className="text-2xl p-4">
                Current plan
            </h2>
            <div className="flex flex-col lg:!flex-row justify-between gap-">
                <PricingCard
                    planExists={agencySubscription?.Subscription?.active == true}
                    prices={prices.data}
                    customerId={agencySubscription?.customerId || ""}
                    amt={
                        agencySubscription?.Subscription?.active === true
                            ? currentPlanDetails?.price || "$0"
                            : "$0"
                    }
                    buttonCta={
                        agencySubscription?.Subscription?.active === true
                            ? "Change Plan"
                            : "Get Started"
                    }
                    highlightDescription="Want to modify your plan? You can do this here. If you have further questions contact support@saas-builder.com"
                    hihglightTitle="Plan Options"
                    description={
                        agencySubscription?.Subscription?.active === true
                        ? currentPlanDetails?.description || "Lets get started"
                        : "Lets get started! Pick a plan that works best for you"
                    }
                    duration="/ month"
                    features={
                        agencySubscription?.Subscription?.active === true
                        ? currentPlanDetails?.features || []
                        : currentPlanDetails?.features || pricingCards.find(pricing => pricing.title === "Starter")?.features || []
                    }
                    title={
                        agencySubscription?.Subscription?.active === true
                        ? currentPlanDetails?.title || "Starter"
                        : "Starter"
                    }
                />
            </div>
            <h2 className="text-2xl p-4">
                Payment History
            </h2>
            <Table className="bg-card border-[1px] border-border rounded-md">
                <TableHeader className="rounded-md">
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Invocie ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="font-medium truncate">
                    {allCharges.map((charge) => (
                        <TableRow key={charge.id}>
                            <TableCell>{charge.description}</TableCell>
                            <TableCell>{charge.id}</TableCell>
                            <TableCell>{charge.date}</TableCell>
                            <TableCell>
                                <p className={cn(
                                    charge.status.toLowerCase() === "paid" && "text-emerald-500",
                                    charge.status.toLowerCase() === "pending" && "text-orange-600",
                                    charge.status.toLowerCase() === "failed" && "text-red-600"
                                )}>
                                    {charge.status.toUpperCase()}
                                </p>
                            </TableCell>
                            <TableCell>{charge.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default BillingPage