import { Blur } from "@/components/blur"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex justify-between items-center w-full h-20 border p-4 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <Image 
                                        src="/appstore.png"
                                        alt="App logo"
                                        height={80}
                                        width={80}
                                        className="rounded-md object-contain"
                                    />
                                    <p>
                                        Save the website as a shortcut on your mobile devide
                                    </p>
                                </div>
                                <Button>
                                    Start
                                </Button>
                            </div>
                            <div className="flex justify-between items-center w-full h-20 border p-4 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <Image 
                                        src="/stripelogo.png"
                                        alt="App logo"
                                        height={80}
                                        width={80}
                                        className="rounded-md object-contain"
                                    />
                                    <p>
                                        Connect your stripe account to accept payments. Strip is used to run payouts.
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center w-full h-20 border p-4 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <Image 
                                        src="/assets/plura-logo.svg"
                                        alt="Logo"
                                        height={80}
                                        width={80}
                                        className="rounded-md object-contain"
                                    />
                                    <p>
                                        Fill in all your business details
                                    </p>
                                </div>
                                {allDetailsExist ? (
                                    <CheckCircle 
                                        size={50}
                                        className="text-primary p-2 flex-shrink-0"
                                    />
                                ) : (
                                    <Link
                                        className="bg-primary py-2 px-4 rounded-md text-white"
                                        href={`/sub-account/${subAccountDetails.id}/settings`}
                                    >
                                        Start
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Blur>
    )
}

export default LaunchPadPage