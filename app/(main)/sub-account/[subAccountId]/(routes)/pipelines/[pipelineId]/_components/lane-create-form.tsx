"use client"

import * as z from "zod"
import { useModal } from "@/components/providers/modal-provider"
import { Lane } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { getPipelineDetails, saveActivityLogsNotification, upsertLane } from "@/lib/queries"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { LaneFormSchema } from "@/lib/types"

interface LaneCreateFormProps {
    pipelineId: string
    defaultData?: Lane
}

export const LaneCreateForm = ({
    pipelineId,
    defaultData
}: LaneCreateFormProps) => {

    const { setClose } = useModal()
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof LaneFormSchema>>({
        resolver: zodResolver(LaneFormSchema),
        mode: "onChange",
        defaultValues: {
            name: defaultData?.name || ""
        }
    })

    useEffect(() => {
        if (defaultData) {
            form.reset({
                name: defaultData.name || ""
            })
        }
    }, [defaultData])

    const isLoading = form.formState.isLoading

    const onSubmit = async (values: z.infer<typeof LaneFormSchema>) => {
        try {
            const response = await upsertLane({
                ...values,
                id: defaultData?.id,
                pipelineId: pipelineId,
                order: defaultData?.order
            })

            const details = await getPipelineDetails(pipelineId)
            
            if (!details) return

            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Updated a lane | ${response?.name}`,
                subAccountId: details.subAccountId
            })

            toast({
                title: "Success"
            })
        } catch {
            toast({
                title: "Something went wrong",
                variant: "destructive"
            })
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    Lane Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Lane name
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
                        <Button
                            variant="outline"
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