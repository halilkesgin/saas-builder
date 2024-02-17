import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries"
import { currentUser } from "@clerk/nextjs"
import { Plan } from "@prisma/client"
import { redirect } from "next/navigation"
import { AgencyDetails } from "./_components/agency-details"

interface AgencyPageProps {
    searchParams: { 
        plan: Plan, 
        state: string, 
        code: string 
    }
}

const AgencyPage = async ({
    searchParams
}: AgencyPageProps) => {
    const agencyId = await verifyAndAcceptInvitation()

    const user = await getAuthUserDetails()

    if (agencyId) {
        if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
            return redirect("/sub-account")
        } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
            if (searchParams.plan) {
                return redirect(`/agency/${agencyId}/billing?=${searchParams.plan}`)
            }

            if (searchParams.state) {
                const statePath = searchParams.state.split("___")[0]
                const stateAgencyId = searchParams.state.split("___")[1]

                if (!stateAgencyId) return <div>Not authorized</div>

                return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`)
            } else {
                return redirect(`/agency/${agencyId}`)
            }
        } else {
            return <div>Not authorized</div>
        }
    }

    const authUser = await currentUser()

    return (
        <div className="flex justify-center items-center mt-">
            <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
                <h1 className="text-4xl">
                    Create an Agency
                </h1>
                <AgencyDetails 
                    data={{
                        companyEmail: authUser?.emailAddresses[0].emailAddress
                    }}
                />
            </div>
        </div>
    )
}

export default AgencyPage