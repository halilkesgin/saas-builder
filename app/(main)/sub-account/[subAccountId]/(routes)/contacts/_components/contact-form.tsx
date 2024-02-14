"use client"

import * as z from "zod"
import { useModal } from "@/components/providers/modal-provider"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { ContactUserFormSchema } from "@/lib/types"
import { saveActivityLogsNotification, upsertContact } from "@/lib/queries"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ContactFormProps {
    subAccountId: string
}

export const ContactForm = ({
    subAccountId
}: ContactFormProps) => {
    const router = useRouter()
    const { setClose, data }= useModal()
    const { toast } = useToast()
    
    const form = useForm<z.infer<typeof ContactUserFormSchema>>({
        resolver: zodResolver(ContactUserFormSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: ""
        }
    })

    useEffect(() => {
        if (data.contact) {
            form.reset(data.contact)
        }
    }, [data, form.reset])

    const handleSubmit = async (values: z.infer<typeof ContactUserFormSchema>) => {
        try {
            const response = await upsertContact({
                email: values.email,
                subAccountId: subAccountId,
                name: values.name
            })

            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Updated a contact | ${response?.name}`,
                subAccountId: subAccountId
            })

            toast({
                title: "Success"
            })

            setClose()
            router.refresh()
        } catch {
            toast({
                title: "Something went wrong",
                variant: "destructive"
            })
        }
    }

    const isLoading = form.formState.isLoading

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    Contact info
                </CardTitle>
                <CardDescription>
                    You can assign tickets to contacts and set a value for each contact in the ticket.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField 
                            control={form.control}
                            disabled={isLoading}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            disabled={isLoading}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email" 
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            variant="outline"
                            type="submit"
                        >
                            {form.formState.isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Save Contact Details"
                            )}
                        </Button>   
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}