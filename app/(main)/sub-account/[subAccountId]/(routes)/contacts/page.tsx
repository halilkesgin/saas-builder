import { Blur } from "@/components/blur"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { db } from "@/lib/db"
import { Contact, SubAccount, Ticket } from "@prisma/client"
import { format } from "date-fns"
import { CreateContactButton } from "./_components/create-contact-button"

interface ContactsPageProps {
    params: { subAccountId: string }
}

const ContactsPage = async ({
    params
}: ContactsPageProps) => {

    type SubAccountWithContacts = SubAccount & {
        Contact: (Contact & { Ticket: Ticket[] })[]
    }

    const contacts = (await db.subAccount.findUnique({
        where: {
            id: params.subAccountId
        },
        include: {
            Contact: {
                include: {
                    Ticket: {
                        select: {
                            value: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    })) as SubAccountWithContacts

    const allContacts = contacts.Contact

    const formatTotal = (tickets: Ticket[]) => {
        if (!tickets || !tickets.length) return "$0.00"
        
        const amt = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD"
        }) 

        const laneAmt = tickets.reduce(
            (sum, ticket) => sum + (Number(ticket?.value) || 0),
            0
        )
        
        return amt.format(laneAmt)
    }

    return (
        <Blur>
            <h1 className="text-4xl p-4">
                Contacts
            </h1>
            <CreateContactButton 
                
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>CreatedDate</TableHead>
                        <TableHead>Total Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="font-medium truncate">
                    {allContacts.map((contact) => (
                        <TableRow key={contact.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage alt="Logo" />
                                    <AvatarFallback>
                                        {contact.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>
                                {contact.email}
                            </TableCell>
                            <TableCell>
                                {formatTotal(contact.Ticket) === "$0.00" ? (
                                    <Badge variant="destructive">
                                        Inactive
                                    </Badge>
                                ) : (
                                    <Badge className="bg-emerald-700">
                                        Active
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                {format(contact.createdAt, "MM/dd/yyyy")}
                            </TableCell>
                            <TableCell>
                                {formatTotal(contact.Ticket)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Blur>
    )
}

export default ContactsPage