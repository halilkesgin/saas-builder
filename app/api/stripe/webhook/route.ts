import Stripe from "stripe"
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

import { stripe } from "@/lib/stripe"
import { subscriptionCreated } from "@/lib/stripe/action"

const stripeWebhookEvents = new Set([
    "product.created",
    "product.updated",
    "price.created",
    "price.updated",
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted"
])

export async function POST(
    req: NextRequest
) {
    let stripeEvent: Stripe.Event

    const body = await req.text()
    const sig = headers().get("Stripe-Signature")

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET

    try {
        if (!sig || !webhookSecret) {
            console.log("Stripe webhook secret or signature does not exist")
            return
        }
        stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (error: any) {
        console.log(`Error ${error.message}`)
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    try {
        if (stripeWebhookEvents.has(stripeEvent.type)) {
            const subscription = stripeEvent.data.object as Stripe.Subscription

            if (
                !subscription.metadata.connectAccountPayments && 
                !subscription.metadata.connectAccountPayments
            ) {
                switch(stripeEvent.type) {
                    case "customer.subscription.created":
                    case "customer.subscription.updated": {
                        if (subscription.status === "active") {
                            await subscriptionCreated(
                                subscription,
                                subscription.customer as string
                            )
                            console.log("Created from webhook", subscription)
                        } else {
                            console.log("Skipped at created from webhook, because subscription status is not active", subscription)
                            break
                        }
                    }
                    default: 
                        console.log("Unhandled relevant event", stripeEvent.type)
                }
            } else {
                console.log("Skipped from webhook, because subscription was from a connected account not for the application.", subscription)
            }
        }
    } catch (error) {
        console.log(error)
        return new NextResponse("Webhook error", { status: 400 })
    }

    return NextResponse.json(
        {webhookActionReceived: true},
        {status: 200}
    )
}