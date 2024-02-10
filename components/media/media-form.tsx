"use client"

import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { createMedia, saveActivityLogsNotification } from "@/lib/queries"
import { Input } from "../ui/input"
import { FileUpload } from "../file-upload"
import { Button } from "../ui/button"

interface MediaFormProps {
    subAccountId: string
}

const formSchema = z.object({
    link: z.string().min(1),
    name: z.string().min(1)
})

export const MediaForm = ({
    subAccountId
}: MediaFormProps) => {
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            link: "",
            name: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await createMedia(subAccountId, values)
            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Uploaded a media file | ${response.name}`,
                subAccountId: subAccountId
            })

            toast({
                title: "Success",
                description: "Uploaded a media file"
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
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    Media Information
                </CardTitle>
                <CardDescription>
                    Please enter the details for your file
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        File name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="Your file name"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        File name
                                    </FormLabel>
                                    <FormControl>
                                        <FileUpload 
                                            apiEndpoint="subaccountLogo"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            variant="outline"
                        >
                            Upload Media
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )

}