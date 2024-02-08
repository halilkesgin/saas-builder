import { Blur } from "@/components/blur"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"

interface LaunchPadPageProps {
    params: {
        subAccountId: string
    }
    searchParams: {
        state: string
        code: string
    }
}

const LaunchPadPage = async ({
    params,
    searchParams
}: LaunchPadPageProps) => {
    const subAccountDetails = await db.subAccount.findUnique({
        where: {
            id: params.subAccountId
        }
    })

    if (!subAccountDetails) {
        return
    }

    const allDetailsExist = 
        subAccountDetails.address &&
        subAccountDetails.city &&
        subAccountDetails.companyEmail &&
        subAccountDetails.companyPhone &&
        subAccountDetails.country &&
        subAccountDetails.name &&
        subAccountDetails.state &&
        subAccountDetails.zipCode



    return (
        <Blur
        
        >
            <div className="flex flex-col justify-center items-center">
                <div className="w-full h-full max-w-[800px]">
                    <Card className="border-0">
                        <CardHeader>
                            <CardTitle>
                                Let's get started!
                            </CardTitle>
                            <CardDescription>
                                Follow the steps below to get your account setup correctly
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </Blur>
    )
}

export default LaunchPadPage