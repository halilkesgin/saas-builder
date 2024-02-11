import * as z from "zod"
import { Role, Notification, Prisma, Lane, Ticket, Tag, User, Contact} from "@prisma/client"
import { getAuthUserDetails, getMedia, getUserPermissions } from "./queries"
import { db } from "./db"

export type NotificationWithUser = ({
    User: {
        id: string
        name: string
        email: string
        createdAt: Date
        updatedAt: Date
        role: Role
        agencyId: string | null
    }
} & Notification)[] | undefined

const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (agencyId: string) => {
    return await db.user.findFirst({
        where: {
            Agency: {
                id: agencyId
            }
        },
        include: {
            Agency: {
                include: {
                    SubAccount: true
                }
            },
            Permissions: {
                include: {
                    SubAccount: true
                }
            }
        }
    })
}

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<typeof getUserPermissions>

export type AuthUserWithAgencySidebarOptionsSubAccounts = Prisma.PromiseReturnType<typeof getAuthUserDetails>

export type UsersWithAgencySubAccountPermissionsSidebarOptions = Prisma.PromiseReturnType<
    typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
>

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>

export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput

export type TicketAndTags = Ticket & {
    Tags: Tag[]
    Assigned: User | null
    Customer: Contact | null
}

export type LaneDetail = Lane & {
    Tickets: TicketAndTags[]
}

export const CreateFunnelFormSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    subDomainName: z.string().optional(),
    favicon: z.string().optional()
})