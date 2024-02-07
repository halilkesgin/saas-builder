"use client"

import * as z from "zod" 

import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { saveActivityLogsNotification, sendInvitation } from "@/lib/queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SendInvitationProps {
    agencyId: string
}

export const SendInvitation = ({
    agencyId
}: SendInvitationProps) => {
    const { toast } = useToast()

    const formSchema = z.object({
        email: z.string().email(),
        role: z.enum(
            ["AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"]
        )
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            role: "SUBACCOUNT_USER"
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await sendInvitation(values.role, values.email, agencyId)

            await saveActivityLogsNotification({
                agencyId: agencyId,
                description: `Invited ${response.email}`,
                subAccountId: undefined
            })

            toast({
                title: "Success",
                description: "Created and sent invitation"
            })
        } catch {
            toast({
                title: "Something went wrong",
                variant: "destructive"
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Invitation
                </CardTitle>
                <CardDescription>
                    An invitation will be sent to the user. Users who already have an invitation sent out their email, will not receive another invitation.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField 
                            disabled={form.formState.isSubmitting}
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            disabled={form.formState.isSubmitting}
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>
                                        User Role
                                    </FormLabel>
                                    <Select 
                                        onValueChange={(value) => field.onChange(value)}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select user role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="AGENCY_ADMIN">
                                                Agency Item
                                            </SelectItem>
                                            <SelectItem value="SUBACCOUNT_USER">
                                                Sub Account User
                                            </SelectItem>
                                            <SelectItem value="SUBACCOUNT_GUEST">
                                                Sub Account Guest
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={form.formState.isSubmitting}
                            type="submit"
                        >
                            {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Invitation"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}