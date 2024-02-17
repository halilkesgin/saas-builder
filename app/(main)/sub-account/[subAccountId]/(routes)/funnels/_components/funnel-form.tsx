"use client"

import React, { useEffect } from "react"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { Funnel } from "@prisma/client"

import { CreateFunnelFormSchema } from "@/lib/types"
import { saveActivityLogsNotification, upsertFunnel } from "@/lib/queries"
import { v4 } from "uuid"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useModal } from "@/components/providers/modal-provider"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CreateFunnelProps {
    defaultData?: Funnel
    subAccountId: string
}


export const FunnelForm: React.FC<CreateFunnelProps> = ({
    defaultData,
    subAccountId,
}) => {
    const { setClose } = useModal()
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof CreateFunnelFormSchema>>({
        mode: "onChange",
        resolver: zodResolver(CreateFunnelFormSchema),
        defaultValues: {
            name: defaultData?.name || "",
            description: defaultData?.description || "",
            subDomainName: defaultData?.subDomainName || "",
        },
    })

    useEffect(() => {
        if (defaultData) {
            form.reset({
                description: defaultData.description || "",
                name: defaultData.name || "",
                subDomainName: defaultData.subDomainName || "",
            })
        }
    }, [defaultData])

    const isLoading = form.formState.isLoading

    const onSubmit = async (values: z.infer<typeof CreateFunnelFormSchema>) => {
        if (!subAccountId) return
        
        const response = await upsertFunnel(
            subAccountId,
            { ...values, liveProducts: defaultData?.liveProducts || "[]" },
            defaultData?.id || v4()
        )
    
        await saveActivityLogsNotification({
            agencyId: undefined,
            description: `Update funnel | ${response.name}`,
            subAccountId: subAccountId,
        })
    
        if (response) {
            toast({
                title: "Success",
                description: "Saved funnel details",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Oppse!",
                description: "Could not save funnel details",
            })
        }
        setClose()
        router.refresh()
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Funnel Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Funnel Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Name"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Funnel Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit more about this funnel."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="subDomainName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sub domain</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Sub domain for funnel"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            className="w-20 mt-4"
                            disabled={isLoading}
                            type="submit"
                        >
                            {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}