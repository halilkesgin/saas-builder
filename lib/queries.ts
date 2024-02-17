"use server"

import * as z from "zod"
import { clerkClient, currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Agency, Lane, Plan, Prisma, Role, SubAccount, Tag, Ticket, User } from "@prisma/client"

import { db } from "./db"
import { v4 } from "uuid"
import { SubAccountDetails } from "@/app/(main)/agency/[agencyId]/_components/sub-account-details"
import { CreateFunnelFormSchema, CreateMediaType, UpsertFunnelPage } from "./types"
import { revalidatePath } from "next/cache"

export const getAuthUserDetails = async () => {
    const user = await currentUser()

    if (!user) {
        return
    }

    const userData = await db.user.findUnique({
        where: {
            email: user.emailAddresses[0].emailAddress
        },
        include: {
            Agency: {
                include: {
                    SidebarOption: true,
                    SubAccount: {
                        include: {
                            SidebarOption: true
                        }
                    }
                }
            },
            Permissions: true
        }
    })

    return userData
}

export const saveActivityLogsNotification = async ({
    agencyId, 
    description, 
    subAccountId
}: {
    agencyId?: string,
    description: string,
    subAccountId?: string
}) => {
    const authUser = await currentUser()

    let userData

    if (!authUser) {
        const response = await db.user.findFirst({
            where: {
                Agency: {
                    SubAccount: {
                        some: {
                            id: subAccountId
                        }
                    }
                }
            }
        })

        if (response) {
            userData = response
        }
    } else {
        userData = await db.user.findUnique({
            where: {
                email: authUser.emailAddresses[0].emailAddress
            }
        })
    }

    if (!userData) {
        console.log("Could not find a user")
        return
    }

    let foundAgencyId = agencyId

    if (!foundAgencyId) {
        if (!subAccountId) {
            throw new Error("You need to provide at least an agency id or subaccount id")
        }

        const response = await db.subAccount.findUnique({
            where: {
                id: subAccountId
            }
        })

        if (response) foundAgencyId = response.agencyId
    }

    if (subAccountId) {
        await db.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: {
                        id: userData.id
                    }
                },
                Agency: {
                    connect: {
                        id: foundAgencyId
                    }
                },
                SubAccount: {
                    connect: {
                        id: subAccountId
                    }
                }
            }
        })
    } else {
        await db.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: {
                        id: userData.id
                    }
                },
                Agency: {
                    connect: {
                        id: foundAgencyId
                    }
                }
            }
        })
    }

}

export const createTeamUser = async (agencyId: string, user: User) => {
    if (user.role === "AGENCY_OWNER") return null

    const response = await db.user.create({
        data: {
            ...user
        }
    })

    return response
}

export const verifyAndAcceptInvitation = async () => {
    const user = await currentUser()

    if (!user) return redirect("/sign-in")

    const invitationExists = await db.invitation.findUnique({
        where: {
            email: user.emailAddresses[0].emailAddress,
            status: "PENDING"
        }
    })

    if (invitationExists) {
        const userDetails = await createTeamUser(invitationExists.agencyId, {
            id: user.id,
            email: invitationExists.email,
            agencyId: invitationExists.agencyId,
            avatarUrl: user.imageUrl,
            name: `${user.firstName} ${user.lastName}`,
            role: invitationExists.role,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await saveActivityLogsNotification({
            agencyId: invitationExists.agencyId,
            description: `Joined`,
            subAccountId: undefined
        })

        if (userDetails) {
            await clerkClient.users.updateUserMetadata(user.id, {
                privateMetadata: {
                    role: userDetails.role || "SUBACCOUNT_USER"
                }
            })

            await db.invitation.delete({
                where: {
                    email: userDetails.email
                }
            })

            return userDetails.agencyId
        } else return null
    } else {
        const agency = await db.user.findUnique({
            where: {
                email: user.emailAddresses[0].emailAddress
            }
        })

        return agency ? agency.agencyId : null
    }
}

export const updateAgencyDetails = async (
    agencyId: string,
    agencyDetails: Partial<Agency>
) => {
    const response = await db.agency.update({
        where: {
            id: agencyId
        },
        data: {
            ...agencyDetails
        }
    })

    return response
}

export const deleteAgency = async (agencyId: string) => {
    const response = await db.agency.delete({
        where: {
            id: agencyId
        }
    })

    return response
}

export const initUser = async (newUser: Partial<User>) => {
    const user = await currentUser()

    if (!user) return

    const userData = await db.user.upsert({
        where: {
            email: user.emailAddresses[0].emailAddress
        },
        update: newUser,
        create: {
            id: user.id,
            avatarUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            role: newUser.role || "SUBACCOUNT_USER"
        }
    })

    await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
            role: newUser.role || "SUBACCOUNT_USER"
        }
    })

    return userData
}

export const upsertAgency = async (agency: Agency, price?: Plan) => {
    if (!agency.companyEmail) return null
    try {
        const agencyDetails = await db.agency.upsert({
            where: {
                id: agency.id,
            },
            update: agency,
            create: {
                users: {
                    connect: { 
                        email: agency.companyEmail 
                    },
                },
                ...agency,
                SidebarOption: {
                    create: [
                        {
                            name: "Dashboard",
                            icon: "category",
                            link: `/agency/${agency.id}`,
                        },
                        {
                            name: "Launch pad",
                            icon: "clipboardIcon",
                            link: `/agency/${agency.id}/launch-pad`,
                        },
                        {
                            name: "Billing",
                            icon: "payment",
                            link: `/agency/${agency.id}/billing`,
                        },
                        {
                            name: "Settings",
                            icon: "settings",
                            link: `/agency/${agency.id}/settings`,
                        },
                        {
                            name: "Sub Accounts",
                            icon: "person",
                            link: `/agency/${agency.id}/all-subaccounts`,
                        },
                        {
                            name: "Team",
                            icon: "shield",
                            link: `/agency/${agency.id}/team`,
                        },
                    ],
                },
            },
        })
        return agencyDetails
    } catch (error) {
        console.log(error)
    }
}

export const getNotificationAndUser = async (agencyId: string) => {
    try {
        const response = await db.notification.findMany({
            where: {
                agencyId
            },
            include: {
                User: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return response
    } catch (error) {
        console.log(error)
    }
} 

export const upsertSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null
  const agencyOwner = await db.user.findFirst({
    where: {
      Agency: {
        id: subAccount.agencyId,
      },
      role: "AGENCY_OWNER",
    },
  })
  if (!agencyOwner) return console.log("🔴Erorr could not create subaccount")
  const permissionId = v4()
  const response = await db.subAccount.upsert({
    where: { id: subAccount.id },
    update: subAccount,
    create: {
      ...subAccount,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      Pipeline: {
        create: { name: "Lead Cycle" },
      },
      SidebarOption: {
        create: [
          {
            name: "Launch pad",
            icon: "clipboardIcon",
            link: `/sub-account/${subAccount.id}/launch-pad`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/sub-account/${subAccount.id}/settings`,
          },
          {
            name: "Funnels",
            icon: "pipelines",
            link: `/sub-account/${subAccount.id}/funnels`,
          },
          {
            name: "Media",
            icon: "database",
            link: `/sub-account/${subAccount.id}/media`,
          },
          {
            name: "Automations",
            icon: "chip",
            link: `/sub-account/${subAccount.id}/automations`,
          },
          {
            name: "Pipelines",
            icon: "flag",
            link: `/sub-account/${subAccount.id}/pipelines`,
          },
          {
            name: "Contacts",
            icon: "person",
            link: `/sub-account/${subAccount.id}/contacts`,
          },
          {
            name: "Dashboard",
            icon: "category",
            link: `/sub-account/${subAccount.id}`,
          },
        ],
      },
    },
  })
  return response
}

export const getUserPermissions = async (userId: string) => {
    const response = await db.user.findUnique({
        where: {
            id: userId
        },
        select: {
            Permissions: {
                include: {
                    SubAccount: true
                }
            }
        }
    })

    return response
}

export const updateUser = async (user: Partial<User>) => {
    const authUser = await currentUser()

    const response = await db.user.update({
        where: {
            email: user.email
        },
        data: {
            ...user
        }
    })

    await clerkClient.users.updateUserMetadata(response.id, {
        privateMetadata: {
            role: user.role || "SUBACCOUNT_USER"
        }
    })

    return response
}

export const changeUserPermissions = async (permissionId: string | undefined, userEmail: string, subAccountId: string, permission: boolean) => {
    try {
        const response = await db.permissions.upsert({
            where: {
                id: permissionId
            },
            update: {
                access: permission
            },
            create: {
                access: permission,
                email: userEmail,
                subAccountId: subAccountId
            }
        })
        return response
    } catch {
        console.log("Could not change permission")
    }
}

export const getSubAccountDetails = async (subAccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: {
            id: subAccountId
        }
    })
    return response
}

export const deleteSubAccount = async (subAccountId: string) => {
    const response = await db.subAccount.delete({
        where: {
            id: subAccountId 
        }
    })
    return response
}

export const deleteUser = async (userId: string) => {
    await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
            role: undefined
        }
    })
    const deletedUser = await db.user.delete({
        where: {
            id: userId
        }
    })

    return deleteUser
}

export const getUser = async (id: string) => {
    const user = await db.user.findUnique({
        where: {
            id
        }
    })

    return user
}

export const sendInvitation = async (
    role: Role,
    email: string,
    agencyId: string
) => {
    const response = await db.invitation.create({
        data: {
            email,
            agencyId,
            role
        }
    })

    try {
        const invitation = await clerkClient.invitations.createInvitation({
            emailAddress: email,
            redirectUrl: process.env.NEXT_PUBLIC_URL,
            publicMetadata: {
                thoughInvitation: true,
                role
            }
        })
    } catch (error) {
        console.log(error)
        throw error
    }
    
    return response
}

export const getMedia = async (subAccountId: string) => {
    const mediafiles = await db.subAccount.findUnique({
        where: {
            id: subAccountId
        },
        include: {
            Media: true
        }
    })
    return mediafiles
}

export const createMedia = async (subAccountId: string, mediaFile: CreateMediaType) => {
    const response = await db.media.create({
        data: {
            link: mediaFile.link,
            name: mediaFile.name,
            subAccountId
        }
    })
    return response
}

export const deleteMedia = async (mediaId: string) => {
    const response = await db.media.delete({
        where: {
            id: mediaId
        }
    })
    return response
}

export const getPipelineDetails = async (pipelineId: string) => {
    const response = await db.pipeline.findUnique({
        where: {
            id: pipelineId
        }
    })

    return response
}

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
    const response = await db.lane.findMany({
        where: {
            pipelineId
        },
        orderBy: {
            order: "asc"
        },
        include: {
            Tickets: {
                orderBy: {
                    order: "asc"
                },
                include: {
                    Tags: true,
                    Assigned: true,
                    Customer: true
                }
            }
        }
    })
    return response
}

export const upsertFunnel = async (
    subAccountId: string,
    funnel: z.infer<typeof CreateFunnelFormSchema> & { liveProducts: string },
    funnelId: string
) => {
    const response = await db.funnel.upsert({
        where: {
            id: funnelId
        },
        update: funnel,
        create: {
            ...funnel,
            id: funnelId || v4(),
            subAccountId
        }
    })
    return response
}

export const upsertPipeline = async (
    pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput
) => {
    const response = await db.pipeline.upsert({
        where: {
            id: pipeline.id || v4()
        },
        update: pipeline,
        create: pipeline
    })
    return response
}

export const deletePipeline = async (pipelineId: string) => {
    const response = await db.pipeline.delete({
        where: {
            id: pipelineId
        }
    })
    return response
}

export const updateLanesOrder = async (lanes: Lane[]) => {
    try {
        const updateTrans = lanes.map((lane) => 
            db.lane.update({
                where: {
                    id: lane.id
                },
                data: {
                    order: lane.order
                }
            })
        )

        await db.$transaction(updateTrans)
        console.log("reordered")
    } catch (error) {
        console.log(error)
    }
}

export const updateTicketOrder = async (tickets: Ticket[]) => {
    try {
        const updateTrans = tickets.map((ticket) => 
            db.ticket.update({
                where: {
                    id: ticket.id
                },
                data: {
                    order: ticket.order,
                    laneId: ticket.laneId
                }
            })
        )

        await db.$transaction(updateTrans)
        console.log("reordered")
    } catch (error) {
        console.log(error)
    }
}

export const upsertLane = async (
    lane: Prisma.LaneUncheckedCreateInput
) => {
    let order: number

    if (!lane.order) {
        const lanes = await db.lane.findMany({
            where: {
                pipelineId: lane.pipelineId
            }
        })

        order = lanes.length
    } else {
        order = lane.order
    }

    const response = await db.lane.upsert({
        where: {
            id: lane.id || v4()
        },
        update: lane,
        create: {
            ...lane,
            order
        }
    })

    return response
}

export const deleteLane = async (
    laneId: string
) => {
    const response = await db.lane.delete({
        where: {
            id: laneId
        }
    })
    return response
}

export const getTicketsWithTags = async (pipelineId: string) => {
    const response = await db.ticket.findMany({
        where: {
            Lane: {
                pipelineId
            }
        },
        include: {
            Tags: true,
            Assigned: true,
            Customer: true
        }
    })
    return response
}

export const _getTicketsWithAllRelations = async (laneId: string) => {
    const response = await db.ticket.findMany({
        where: {
            laneId
        },
        include: {
            Assigned: true,
            Customer: true,
            Lane: true,
            Tags: true
        }
    })

    return response
}

export const getSubAccountTeamMembers = async (subAccountId: string) => {
    const response = await db.user.findMany({
        where: {
            Agency: {
                SubAccount: {
                    some: {
                        id: subAccountId
                    }
                }
            },
            role: "SUBACCOUNT_USER",
            Permissions: {
                some: {
                    subAccountId,
                    access: true
                }
            }
        }
    })
    return response
}

export const searchContacts = async (searchTerms: string) => {
    const response = await db.contact.findMany({
        where: {
            name: {
                contains: searchTerms
            }
        }
    })
    return response
}

export const upsertTicket = async (
    ticket: Prisma.TicketUncheckedCreateInput,
    tags: Tag[]
) => {
    let order: number

    if (!ticket.order) {
        const tickets = await db.ticket.findMany({
            where: {
                laneId: ticket.laneId
            }
        })
        order = tickets.length
    } else {
        order = ticket.order
    }

    const response = await db.ticket.upsert({
        where: {
            id: ticket.id || v4()
        },
        update: {
            ...ticket,
            Tags: {
                set: tags
            }
        },
        create: {
            ...ticket,
            Tags: {
                connect: tags,
            },
            order
        },
        include: {
            Assigned: true,
            Customer: true,
            Tags: true,
            Lane: true
        }
    })
    return response
}

export const deleteTicket = async (ticketId: string) => {
    const response = await db.ticket.delete({
        where: {
            id: ticketId,
        },
    })
    return response
}


export const upsertTag = async (
    subAccountId: string,
    tag: Prisma.TagUncheckedCreateInput
) => {
    const response = await db.tag.upsert({
        where: {
            id: tag.id || v4(),
            subAccountId
        },
        update: tag,
        create: {
            ...tag,
            subAccountId
        }
    })
    return response
}

export const deleteTag = async (
    tagId: string
) => {
    const response = await db.tag.delete({
        where: {
            id: tagId
        }
    })
    return response
}

export const getTagsForSubaccount = async (subAccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: {
            id: subAccountId
        },
        select: {
            Tags: true
        }
    })
    return response
}

export const upsertContact = async (contact: Prisma.ContactUncheckedCreateInput) => {
    const response = await db.contact.upsert({
        where: {
            id: contact.id || v4(),
        },
        update: contact,
        create: contact
    })
    return response
}

export const getFunnels = async (subAccountId: string) => {
    const funnels = await db.funnel.findMany({
        where: { 
            subAccountId
        },
        include: { 
            FunnelPages: true 
        },
    })

    return funnels
}

export const getFunnel = async (funnelId: string) => {
    const funnel = await db.funnel.findUnique({
        where: { 
            id: funnelId 
        },
        include: {
            FunnelPages: {
                orderBy: {
                    order: "asc",
                },
            },
        },
    })
    return funnel
}

export const upsertFunnelPage = async (
    subAccountId: string,
    funnelPage: UpsertFunnelPage,
    funnelId: string
) => {
    if (!subAccountId || !funnelId) return
    
    const response = await db.funnelPage.upsert({
        where: { 
            id: funnelPage.id || ""
        },
        update: { ...funnelPage },
        create: {
            ...funnelPage,
            content: funnelPage.content ? funnelPage.content : JSON.stringify([
                {
                    content: [],
                    id: "__body",
                    name: "Body",
                    styles: { backgroundColor: "white" },
                    type: "__body",
                },
            ]),
        funnelId,
        },
    })
    revalidatePath(`/sub-account/${subAccountId}/funnels/${funnelId}`, "page")
    return response
}

export const deleteFunnelPage = async (funnelPageId: string) => {
    const response = await db.funnelPage.delete({ 
        where: { 
            id: funnelPageId 
        } 
    })

    return response
}

export const updateFunnelProducts = async (
    products: string,
    funnelId: string
) => {
    const data = await db.funnel.update({
        where: { 
            id: funnelId 
        },
        data: { 
            liveProducts: products 
        },
    })
    return data
}

export const getFunnelPageDetails = async (funnelPageId: string) => {
    const response = await db.funnelPage.findUnique({
        where: {
            id: funnelPageId,
        },
    })
    return response
}

export const getSubaccountDetails = async (subAccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: {
            id: subAccountId,
        },
    })
    return response
}