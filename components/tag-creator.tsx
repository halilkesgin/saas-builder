"use client"

import { Tag } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"
import { Tag as TagComponent } from "@/app/(main)/sub-account/[subAccountId]/(routes)/pipelines/[pipelineId]/_components/tag"
import { PlusCircleIcon, Trash2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { v4 } from "uuid"
import { deleteTag, getTagsForSubaccount, saveActivityLogsNotification, upsertTag } from "@/lib/queries"

interface TagCreatorProps {
    subAccountId: string
    getSelectedTags: (tags: Tag[]) => void
    defaultTags?: Tag[]
}

const TagColors= ["BLUE", "ORANGE", "ROSE", "PURPLE", "GREEN"] as const

export type TagColor = (typeof TagColors)[number]

export const TagCreator = ({
    subAccountId,
    getSelectedTags,
    defaultTags
}: TagCreatorProps) => {
    const { toast } = useToast()
    const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags || [])
    const [tags, setTags] = useState<Tag[]>([])
    const [value, setValue] = useState("")
    const [selectedColor, setSelectedColor] = useState("")

    const router = useRouter()

    useEffect(() => {
        getSelectedTags(selectedTags)
    }, [selectedTags])

    useEffect(() => {
        if (subAccountId) {
            const fetchData = async () => {
                const response = await getTagsForSubaccount(subAccountId)
                if (response) setTags(response.Tags)
            }
            fetchData()
        }
    }, [subAccountId])

    const handleDeleteSection = (tagId: string) => {
        setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId))
    }

    const handleAddTag = async () => {
        if (!value) {
            toast({
                title: "Tags need to have a name",
                variant: "destructive"
            })
            return
        }

        if (!selectedColor) {
            toast({
                title: "Please select a color",
                variant: "destructive"
            })
            return
        }

        const tagData: Tag = {
            color: selectedColor,
            createdAt: new Date(),
            id: v4(),
            name: value,
            subAccountId,
            updatedAt: new Date()
        }

        setTags([...tags, tagData])
        setValue("")
        setSelectedColor("")
        
        try {
            const response = await upsertTag(subAccountId, tagData) 
            toast({
                title: "Created the tag"
            })

            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Updated a tag | ${response?.name}`,
                subAccountId
            })

        } catch {
            toast({
                title: "Something went wrong",
                variant: "destructive"
            })
        }
    }

    const handleAddSelections = (tag: Tag) => {
        if (selectedTags.every((t) => t.id !== tag.id)) {
            setSelectedTags([...selectedTags, tag])
        }
    } 
  
    const handleDeleteTag = async (tagId: string) => {
        setTags(tags.filter((tag) => tag.id !== tagId))
        try {
            const response = await deleteTag(tagId)
            toast({
                title: "Deleted tag",
                description: "The tag is deleted from your subaccount.",
            })
            await saveActivityLogsNotification({
                agencyId: undefined,
                description: `Deleted a tag | ${response?.name}`,
                subAccountId: subAccountId,
            })
            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Could not delete tag",
            })
        }
    }

    return (
        <AlertDialog>
            <Command className="bg-transparent">
                {!!selectedTags.length && (
                    <div className="flex flex-wrap gap-2 p-2 bg-background border-2 border-border rounded-md">
                        {selectedTags.map((tag) => (
                            <div 
                                key={tag.id}
                                className="flex items-center"
                            >
                                <TagComponent 
                                    title={tag.name}
                                    color={tag.color}
                                />
                                <X 
                                    className="text-muted-foreground cursor-pointer h-4 w-4"
                                    onClick={() => handleDeleteSection(tag.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-2 my-2">
                    {TagColors.map((tagColor) => (
                        <TagComponent 
                            key={tagColor}
                            selectedColor={setSelectedColor}
                            title=""
                            color={tagColor}
                        />
                    ))}
                </div>
                <div className="relative">
                    <CommandInput 
                        placeholder="Type a command or search..."
                        value={value}
                        onValueChange={setValue}
                    />
                    <PlusCircleIcon 
                        onClick={handleAddTag}
                        className="h-4 w-4 absolute top-1/2 transform -translate-y-1/2 right-2 hover:text-primary transition-all cursor-pointer text-muted-foreground"                        
                    />
                </div>
                <CommandList>
                    <CommandSeparator />
                    <CommandGroup heading="Tags">
                        {tags.map((tag) => (
                            <CommandItem
                                key={tag.id}
                                className="hover:!bg-secondary !bg-transparent flex items-center justify-between !font-light cursor-pointer"
                            >
                                <div onClick={() => handleAddSelections(tag)}>
                                    <TagComponent 
                                        title={tag.name}
                                        color={tag.color}
                                    />
                                </div>
                                <AlertDialogTrigger>
                                    <Trash2 className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-rose-400 transition-all" />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-left">
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-left">
                                            This action cannot be undone. This will permanently delete your tag and remove it from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex items-center gap-2">
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive"
                                            onClick={() => handleDeleteTag(tag.id)}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandEmpty>
                        No results found.
                    </CommandEmpty>
                </CommandList>
            </Command>
        </AlertDialog>
    )
}