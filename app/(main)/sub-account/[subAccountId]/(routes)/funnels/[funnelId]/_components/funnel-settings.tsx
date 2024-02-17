import React from "react"

import { Funnel, SubAccount } from "@prisma/client"
import { db } from "@/lib/db"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getConnectAccountProducts } from "@/lib/stripe/action"
import { FunnelForm } from "../../_components/funnel-form"
import { FunnelProductsTable } from "./funnel-products-table"

interface FunnelSettingsProps {
    subAccountId: string
    defaultData: Funnel
}

export const FunnelSettings: React.FC<FunnelSettingsProps> = async ({
    subAccountId,
    defaultData,
}) => {

    const subaccountDetails = await db.subAccount.findUnique({
        where: {
            id: subAccountId,
        },
    })

    if (!subaccountDetails) return
    if (!subaccountDetails.connectAccountId) return
  
    const products = await getConnectAccountProducts(subaccountDetails.connectAccountId)

    return (
        <div className="flex gap-4 flex-col xl:!flex-row">
            <Card className="flex-1 flex-shrink">
                <CardHeader>
                    <CardTitle>Funnel Products</CardTitle>
                    <CardDescription>
                        Select the products and services you wish to sell on this funnel.
                        You can sell one time and recurring products too.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <>
                        {subaccountDetails.connectAccountId ? (
                            <FunnelProductsTable
                                defaultData={defaultData}
                                products={products}
                            />
                        ) : (
                            "Connect your stripe account to sell products."
                        )}
                    </>
                </CardContent>
            </Card>
            <FunnelForm
                subAccountId={subAccountId}
                defaultData={defaultData}
            />
        </div>
    )
}