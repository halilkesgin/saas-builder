import { GetMediaFiles } from "@/lib/types"
import { UploadButton } from "./upload-button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { MediaCard } from "./media-card"
import { FolderSearch } from "lucide-react"

interface MediaProps {
    data: GetMediaFiles
    subAccountId: string
}

export const Media = ({
    data,
    subAccountId
}: MediaProps) => {
    return (
        <div className="flex flex-col gap-4 h-full w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl">
                    Media Bucket
                </h1>
                <UploadButton 
                    subAccountId={subAccountId}
                />
                <Command className="bg-transparent">
                    <CommandInput placeholder="Search for file name" />
                    <CommandGroup title="Media">
                        <CommandList className="pb-40 max-h-full">
                            <CommandEmpty>
                                No media files
                            </CommandEmpty>
                            <div className="flex flex-wrap gap-4 pt-4">
                                {data?.Media.map((file) => (
                                    <CommandItem 
                                        key={file.id}
                                        className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                                    >
                                        <MediaCard 
                                            file={file}
                                        />
                                    </CommandItem>
                                ))}
                                {!data?.Media.length && (
                                    <div className="flex items-center justify-center w-full flex-col">
                                        <FolderSearch 
                                            size={200}
                                            className="dark:text-muted text-slate-300"
                                        />
                                        <p className="text-muted-foreground">
                                            Empty! No files to show.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CommandList>
                    </CommandGroup>
                </Command>
            </div>
        </div>
    )
}