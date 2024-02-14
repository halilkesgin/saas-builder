import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(
    req: Request
) {
    const { customerId, priceId } = await req.json()

    if (!customerId || !priceId) {
        return new NextResponse("CustomerId and PriceId is missing", { status: 400 })
    }

    const subscriptionExist = await db.agency.findFirst({
        where: {
            customerId
        },
        include: {
            Subscription: true
        }
    })

    try {
        if (
            subscriptionExist?.Subscription?.subscritiptionId &&
            subscriptionExist.Subscription.active
        ) {
            if (!subscriptionExist.Subscription.subscritiptionId) {
                throw new Error("Could not find the subscription id to update the subscription.")
            }

            console.log("Updating the subscription.")

            const currentSubscriptionDetails = await stripe.subscriptions.retrieve(
                subscriptionExist.Subscription.subscritiptionId
            )

            const subscription = await stripe.subscriptions.update(
                subscriptionExist.Subscription.subscritiptionId, {
                    items: [
                        {
                            id: currentSubscriptionDetails.items.data[0].id,
                            deleted: true
                        },
                        {
                            price: priceId
                        }
                    ],
                    expand: ["latest_invoice.payment_intent"]
                }
            )

            return NextResponse.json({
                subscriptionId: subscription.id,
                //@ts-ignore
                clientSecret: subscription.latest_invoice.payment_intent.client_secret
            })
        } else {
            console.log("Creating sub")

            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [
                    {
                        price: priceId
                    }
                ],
                payment_behavior: "default_incomplete",
                payment_settings: {
                    save_default_payment_method: "on_subscription"
                },
                expand: [
                    "latest_invoice.payment_intent"
                ]
            })

            return NextResponse.json({
                subscriptionId: subscription.id,
                //@ts-ignore
                clientSecret: subscription.latest_invoice.payment_intent.client_secret
            })
        }
    } catch {
        return new NextResponse("Internal error", { status: 500 })
    }
}