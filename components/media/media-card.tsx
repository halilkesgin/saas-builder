"use client"

import { useState } from "react"
import { Media } from "@prisma/client"
import { useRouter } from "next/navigation"
import { deleteMedia, saveActivityLogsNotification } from "@/lib/queries"
import Image from "next/image"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Copy, MoreHorizontal, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MediaCardProps {
    file: Media
}

export const MediaCard = ({
    file
}: MediaCardProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    return (
        <AlertDialog>
            <DropdownMenu>
                <article className="border w-full rounded-lg bg-slate-900">
                    <div className="relative w-full h-40">
                        <Image
                            src={file.link}
                            alt="preview image"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <p className="opacity-0 h-0 w-0">{file.name}</p>
                    <div className="p-4 relative">
                        <p className="text-muted-foreground">
                            {file.createdAt.toDateString()}
                        </p>
                        <p>{file.name}</p>
                        <div className="absolute top-4 right-4 p-[1px] cursor-pointer ">
                            <DropdownMenuTrigger>
                                <MoreHorizontal />
                            </DropdownMenuTrigger>
                        </div>
                    </div>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Menu</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="flex gap-2"
                            onClick={() => {
                                navigator.clipboard.writeText(file.link)
                                toast({ title: 'Copied To Clipboard' })
                            }}
                        >
                            <Copy size={15} /> Copy Image Link
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="flex gap-2">
                                <Trash size={15} /> Delete File
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </article>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                        Are you sure you want to delete this file? All subaccount using this
                        file will no longer have access to it!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isLoading}
                        className="bg-destructive hover:bg-destructive"
                        onClick={async () => {
                            setIsLoading(true)
                            const response = await deleteMedia(file.id)
                            await saveActivityLogsNotification({
                                agencyId: undefined,
                                description: `Deleted a media file | ${response?.name}`,
                                subAccountId: response.subAccountId,
                            })
                            toast({
                                title: 'Deleted File',
                                description: 'Successfully deleted the file',
                            })
                            setIsLoading(false)
                            router.refresh()
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}