"use client"

import { CustomModal } from "@/components/custom-modal"
import { useModal } from "@/components/providers/modal-provider"
import { SubscriptionFormWrapper } from "@/components/subscription-form/form-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PricesList } from "@/lib/types"
import { useSearchParams } from "next/navigation"

interface PricingCardProps {
    features: string[]
    customerId: string
    buttonCta: string
    title: string
    description: string
    amt: string
    duration: string
    hihglightTitle: string
    highlightDescription: string
    prices: PricesList["data"]
    planExists: boolean
}

export const PricingCard = ({
    features,
    buttonCta,
    customerId,
    title,
    description,
    amt,
    duration,
    hihglightTitle,
    highlightDescription,
    prices,
    planExists
}: PricingCardProps) => {
    const { setOpen } = useModal()
    
    const searchParams = useSearchParams()
    const plan = searchParams.get("plan")

    const handleManagePlan = async () => {
        setOpen(
            <CustomModal
                title="Manage your Plan"
                description="You can change your plan at any time from the billings settings"
            >
                <SubscriptionFormWrapper 
                    customerId={customerId}
                    planExists={planExists}
                />
            </CustomModal>,
            async () => ({
                plans: {
                    defaultPriceId: plan ? plan : "",
                    plans: prices
                }
            })
        )
    }

    return (
        <Card className="flex flex-col justify-between lg:w-1/2">
            <div className="">
                <CardHeader className="flex flex-col md:!flex-row justify-between">
                    <div>
                        <CardTitle>
                            {title}
                        </CardTitle>
                        <CardDescription>
                            {description}
                        </CardDescription>
                    </div>
                    <p className="text-6xl font-bold">
                        {amt}
                        <small className="text-xs font-light">
                            {duration}
                        </small>
                    </p>
                </CardHeader>
                <CardContent>
                    <ul>
                        {features.map((feature) => (
                            <li
                                key={feature}
                                className="list-disc ml-4 text-muted-foreground"
                            >
                                {feature}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </div>
            <CardFooter>
                <Card className="w-full">
                    <div className="flex flex-col md:!flex-row items-center justify-between rounded-lg border gap-4 p-4">
                        <div>
                            <p>
                                {hihglightTitle}  
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {highlightDescription}
                            </p>
                        </div>
                        <Button
                            className="md:w-fit w-full"
                            onClick={handleManagePlan}
                        >
                            {buttonCta}
                        </Button>
                    </div>
                </Card>
            </CardFooter>
        </Card>
    )
}