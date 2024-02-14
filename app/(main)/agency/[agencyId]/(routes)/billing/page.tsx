import { Separator } from "@/components/ui/separator"
import { addOnProducts, pricingCards } from "@/lib/constants"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { PricingCard } from "./_components/pricing-card"

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
                    
                />
            </div>
        </>
    )
}

export default BillingPage