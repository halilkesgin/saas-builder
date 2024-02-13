import { UserDetails } from "@/app/(main)/agency/[agencyId]/(routes)/settings/_components/user-details"
import { SubAccountDetails } from "@/app/(main)/agency/[agencyId]/_components/sub-account-details"
import { Blur } from "@/components/blur"
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"

interface SettingsPageProps {
    params: { subAccountId: string }
}

const SettingsPage = async ({
    params
}: SettingsPageProps) => {
    const authUser = await currentUser()

    if (!authUser) return

    const userDetails = await db.user.findUnique({
        where: {
            email: authUser.emailAddresses[0].emailAddress
        }
    })

    if (!userDetails) return

    const subAccount = await db.subAccount.findUnique({
        where: {
            id: params.subAccountId
        }
    })

    const agencyDetails = await db.agency.findUnique({
        where: {
            id: subAccount?.agencyId
        },
        include: {
            SubAccount: true
        }
    })

    if (!agencyDetails) return

    const subAccounts = agencyDetails.SubAccount

    return (
        <Blur>
            <div className="flex lg:flex-row flex-col gap-4">
                <SubAccountDetails 
                    agencyDetails={agencyDetails}
                    details={subAccount}
                    userId={userDetails.id}
                    userName={userDetails.name}
                />
                <UserDetails 
                    type="subaccount"
                    id={params.subAccountId}
                    subAccounts={subAccounts}
                    userData={userDetails}
                />
            </div>
        </Blur>
    )
}

export default SettingsPage