import { Unauthorized } from "@/components/unauthorized"
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries"
import { redirect } from "next/navigation"

interface SubAccountPageProps {
    searchParams: { state: string, code: string }
}

const SubAccountPage = async ({
    searchParams
}: SubAccountPageProps) => {
    const agencyId = await verifyAndAcceptInvitation()
    
    if (!agencyId) {
        return <Unauthorized />
    }

    const user = await getAuthUserDetails()

    if (!user) return

    const getFirstSubAccountWithAccess = user.Permissions.find((permission) => permission.access === true)

    if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0]
        const stateSubAccountId = searchParams.state.split("___")[1]

        if (!stateSubAccountId) {
            return (
                <Unauthorized />
            )
        }

        return redirect(`/sub-account/${stateSubAccountId}/${statePath}?code=${searchParams.code}`)
    }

    if (getFirstSubAccountWithAccess) {
        return redirect(`/sub-account/${getFirstSubAccountWithAccess.subAccountId}`)
    }

    return (
        <Unauthorized />
    )
}

export default SubAccountPage