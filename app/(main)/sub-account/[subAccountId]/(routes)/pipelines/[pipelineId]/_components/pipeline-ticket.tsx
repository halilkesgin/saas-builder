"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TicketWithTags } from "@/lib/types"
import { Contact2, Edit2, LinkIcon, MoreHorizontal, Trash2, User2 } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { Draggable } from "react-beautiful-dnd"
import { Tag } from "./tag"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useModal } from "@/components/providers/modal-provider"
import { CustomModal } from "@/components/custom-modal"
import { TicketForm } from "./ticket-form"
import { useToast } from "@/hooks/use-toast"
import { deleteTicket, saveActivityLogsNotification } from "@/lib/queries"

interface PipelineTicketProps {
    setAllTickets: Dispatch<SetStateAction<TicketWithTags>>
    ticket: TicketWithTags[0]
    subAccountId: string
    allTickets: TicketWithTags
    index: number
}

export const PipelineTicket = ({
    setAllTickets,
    ticket,
    subAccountId,
    allTickets,
    index
}: PipelineTicketProps) => {
    const router = useRouter()
    const { setOpen, data } = useModal()
    const { toast } = useToast()

    const editNewTicket = (ticket: TicketWithTags[0]) => {
        setAllTickets((tickets) => 
            allTickets.map((t) => {
                if (t.id === ticket.id) {
                    return ticket
                }
                return t
            })
        )
    }

    const handleClickEdit = async () => {
        setOpen(
            <CustomModal
                title="Update ticket details"
                description="Edit your ticket details"
            > 
                <TicketForm 
                    getNewTicket={editNewTicket}
                    laneId={ticket.laneId}
                    subAccountId={subAccountId}
                />
            </CustomModal>
        )
    }

    const handleDeleteTicket = async () => {
        try {
            setAllTickets((tickets) => tickets.filter((t) => t.id !== ticket.id))
            
            const response = await deleteTicket(ticket.id)
            
            toast({
                title: "Deleted"
            })

            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Deleted a ticket | ${response?.name}`,
                subAccountId
            })

            router.refresh()
        } catch {
            toast({
                title: "Something went wrong",
                variant: "destructive"
            })
        }
    }
    
    return (
        <Draggable
            draggableId={ticket.id.toString()}
            index={index}
        >
            {(provided, snapshot) => {
                if (snapshot.isDragging) {
                    const offset = { x:300, y: 20 }

                    //@ts-ignore
                    const x = provided.draggableProps.style?.left - offset.x

                    //@ts-ignore
                    const y = provided.draggableProps.style?.top - offset.y

                    //@ts-ignore
                    provided.draggableProps.style = {
                        ...provided.draggableProps.style,
                        top: x,
                        left: y
                    }
                }
                return (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <AlertDialog>
                            <DropdownMenu>
                                <Card className="my-4 dark:bg-slate-900 bg-white shadow-none transition-all">
                                    <CardHeader className="p-[12px]">
                                        <CardTitle className="flex items-center justify-between gap-2">
                                            <span className="text-lg w-full">
                                                {ticket.name}
                                            </span>
                                            <DropdownMenuTrigger>
                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                            </DropdownMenuTrigger>
                                        </CardTitle>
                                        <span className="text-muted-foreground text-xs">
                                            {new Date().toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center flex-wrap gap-2">
                                            {ticket.Tags.map((tag) => (
                                                <Tag
                                                    key={tag.id}
                                                    title={tag.name}
                                                    color={tag.color}
                                                />
                                            ))}
                                        </div>
                                        <CardDescription className="w-full">
                                            {ticket.description}
                                        </CardDescription>
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <div className="p-2 text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer items-center">
                                                    <LinkIcon className="h-4 w-4" />
                                                    <span className="text-xs font-bold">
                                                        Contact
                                                    </span>
                                                </div>
                                            </HoverCardTrigger>
                                            <HoverCardContent side="right" className="w-fit">
                                                <div className="flex justify-between space-x-4">
                                                    <Avatar>
                                                        <AvatarImage />
                                                        <AvatarFallback className="bg-primary">
                                                            {ticket.Customer?.name.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <h4 className="text-sm font-semibold">
                                                            {ticket.Customer?.name}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {ticket.Customer?.email}
                                                        </p>
                                                        <div className="flex items-center gap-2 pt-2">
                                                            <Contact2 className="h-4 w-4 opacity-70" />
                                                            <span className="text-xs text-muted-foreground">
                                                                Joined{" "}
                                                                {ticket.Customer?.createdAt.toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                    </CardHeader>
                                    <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage 
                                                    alt="Contact"
                                                    src={ticket.Assigned?.avatarUrl}
                                                />
                                                <AvatarFallback className="bg-primary text-sm text-white">
                                                    {ticket.Assigned?.name}
                                                    {!ticket.assignedUserId && <User2 className="h-4 w-4" />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col justify-center">
                                                <span className="text-sm text-muted-foreground">
                                                    {ticket.assignedUserId ? "Assigned to" : "Not Assigned"}
                                                </span>
                                                {ticket.assignedUserId && (
                                                    <span className="text-xs w-28 overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
                                                        {ticket.Assigned?.name}
                                                    </span>    
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold">
                                            {!!ticket.value && new Intl.NumberFormat(undefined, {
                                                style: "currency",
                                                currency: "USD"
                                            }).format(+ticket.value)}
                                        </span>
                                    </CardFooter>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            Options
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <AlertDialogTrigger>
                                            <DropdownMenuItem className="flex items-center gap-2">
                                                <Trash2 className="h-4 w-4" />
                                                <span className="text-muted-foreground">
                                                    Delete Ticket
                                                </span>
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <DropdownMenuItem className="flex items-center gap-2" onClick={handleClickEdit}>
                                            <Edit2 className="h-4 w-4" />
                                            <span className="text-muted-foreground">
                                                Edit Ticket
                                            </span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </Card>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDescription>
                                            This action cannot be undone. This will permanently delete the ticket and remove it from our servers.
                                        </AlertDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex items-center gap-2">
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive"
                                            onClick={handleDeleteTicket}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </DropdownMenu>
                        </AlertDialog>
                    </div>
                )
            }}
        </Draggable>
    )
}