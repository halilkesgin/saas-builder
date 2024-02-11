"use client"

import React, { useEffect } from "react"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { Funnel, Pipeline } from "@prisma/client"

import {
    saveActivityLogsNotification,
    upsertFunnel,
    upsertPipeline,
} from "@/lib/queries"
import { v4 } from "uuid"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useModal } from "@/components/providers/modal-provider"

interface CreatePipelineFormProps {
    defaultData?: Pipeline
    subAccountId: string
}

export const PipelineCreateForm: React.FC<CreatePipelineFormProps> = ({
    defaultData,
    subAccountId,
}) => {
    const { data, isOpen, setOpen, setClose } = useModal()
    const router = useRouter()
    const { toast } = useToast()

    const formSchema = z.object({
        name: z.string().min(1)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: defaultData?.name || "",
        },
    })

    useEffect(() => {
        if (defaultData) {
            form.reset({
                name: defaultData.name || "",
            })
        }
    }, [defaultData])

    const isLoading = form.formState.isLoading

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!subAccountId) return
        try {
            const response = await upsertPipeline({
                ...values,
                id: defaultData?.id,
                subAccountId: subAccountId,
            })

            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Updates a pipeline | ${response?.name}`,
                subAccountId: subAccountId,
            })

            toast({
                title: "Success",
                description: "Saved pipeline details",
            })

            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Oppse!",
                description: "Could not save pipeline details",
            })
        }

        setClose()
    }
  
    return (
        <Card className="w-full ">
            <CardHeader>
                <CardTitle>Pipeline Details</CardTitle>
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
                                    <FormLabel>Pipeline Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
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
