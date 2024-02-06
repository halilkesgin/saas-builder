import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { CheckCircleIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface LaunchPadPageProps {
    params: { agencyId: string }
    searchParams: { code: string }
}

const LaunchPadPage = async ({
    params,
    searchParams
}: LaunchPadPageProps) => {

    const agencyDetails = await db.agency.findUnique({
        where: {
            id: params.agencyId
        }
    })

    if (!agencyDetails) return 

    const allDetailsExist = 
        agencyDetails.address &&
        agencyDetails.city &&
        agencyDetails.companyEmail &&
        agencyDetails.companyPhone &&
        agencyDetails.country &&
        agencyDetails.name &&
        agencyDetails.state &&
        agencyDetails.zipCode


    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-full h-full max-w-[800px]">
                <Card className="border-none">
                    <CardHeader>
                        <CardTitle>
                            Lets get started!
                        </CardTitle>
                        <CardDescription>
                            Follow the steps below to get your account setup.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                            <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                                <Image 
                                    src="/appstore.png"
                                    alt="App Logo"
                                    height={80}
                                    width={80}
                                    className="rounded-md object-contain"
                                />
                                <p className="text-sm">
                                    Save the website as a shortcut on your mobile device
                                </p>
                            </div>
                            <Button>
                                Start
                            </Button>
                        </div>
                        <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                            <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                                <Image 
                                    src="/stripelogo.png"
                                    alt="App Logo"
                                    height={80}
                                    width={80}
                                    className="rounded-md object-contain"
                                />
                                <p className="text-sm">
                                    Connect your stripe account to accept payments and see your dashboard.
                                </p>
                            </div>
                            <Button>
                                Start
                            </Button>
                        </div>
                        <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                            <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                                <Image 
                                    src="/assets/plura-logo.svg"
                                    alt="App Logo"
                                    height={80}
                                    width={80}
                                    className="rounded-md object-contain"
                                />
                                <p className="text-sm">
                                    Fill in all your business details.
                                </p>
                            </div>
                            {allDetailsExist ? (
                                <CheckCircleIcon size={50} className="tet-primary p-2 flex-shrink-0" />
                            ) : (
                                <Link href={`/agency/${params.agencyId}/settings`} className="bg-primary">
                                    Start
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default LaunchPadPage