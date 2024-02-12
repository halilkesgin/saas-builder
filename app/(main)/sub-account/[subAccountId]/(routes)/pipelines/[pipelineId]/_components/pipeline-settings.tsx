"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { deletePipeline } from "@/lib/queries"
import { Pipeline } from "@prisma/client"
import { useRouter } from "next/navigation"
import { PipelineCreateForm } from "./pipeline-create-form"

interface PipelineSettingsProps {
    pipelineId: string
    subAccountId: string
    pipelines: Pipeline[]
}

export const PipelineSettings = ({
    pipelineId,
    subAccountId,
    pipelines
}: PipelineSettingsProps) => {
    const router = useRouter()
    const { toast } = useToast()

    const onSubmit = async () => {
        try {
            await deletePipeline(pipelineId)
            toast({
                title: "Deleted",
                description: "Pipeline is deleted"
            })
        } catch {
            toast({
                title: "Something went wrong",
                variant: "destructive"
            })
        }
    }

    return (
        <AlertDialog>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="items-center">
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={onSubmit}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </div>
                <PipelineCreateForm 
                    subAccountId={subAccountId}
                    defaultData={pipelines.find((p) => p.id === pipelineId)}
                />
            </div>
        </AlertDialog>
    )
}