"use client"

import { Pipeline } from "@prisma/client"
import { useState } from "react"
import { Check, ChevronsDown, Plus } from "lucide-react"

import { useModal } from "@/components/providers/modal-provider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CustomModal } from "@/components/custom-modal"
import { PipelineCreateForm } from "./pipeline-create-form"

interface PipelineInfoBarProps {
    subAccountId: string
    pipelines: Pipeline[]
    pipelineId: string
}

export const PipelineInfoBar = ({
    subAccountId,
    pipelineId,
    pipelines
}: PipelineInfoBarProps) => {
    const { setOpen: setOpenModal, setClose } = useModal()
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(pipelineId)

    const handleClickCreatePipeline = async () => {
        setOpenModal(
            <CustomModal
                title="Create a pipeline"
                description="Pipelines allows you to group tickets into lanes and track your business processes all in one place"
            >
                <PipelineCreateForm subAccountId={subAccountId} />
            </CustomModal>
        )
    }

    return (
        <div>
            <div className="flex items-end gap-2">
                <Popover
                    open={open}
                    onOpenChange={setOpen}
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {value ? pipelines.find((pipeline) => pipeline.id === value)?.name : "Select a pipeline"}
                            <ChevronsDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandEmpty>
                                No pipelines found.
                            </CommandEmpty>
                            <CommandGroup>
                                {pipelines.map((pipeline) => (
                                    <Link
                                        key={pipeline.id}    
                                        href={`/sub-account/${subAccountId}/pipelines/${pipeline.id}`}
                                    >
                                        <CommandItem
                                            key={pipeline.id}
                                            value={pipeline.id}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue)
                                                setOpen(false)
                                            }}                                            
                                        >
                                            <Check className={cn(
                                                "mr-2 h-4 w-4",
                                                value === pipeline.id ? "opacity-100" : "opacity-0"
                                            )} />
                                            {pipeline.name}
                                        </CommandItem>
                                    </Link>
                                ))}
                                <Button
                                    variant="secondary"
                                    className="flex gap-2 w-full mt-4"
                                    onClick={handleClickCreatePipeline}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create pipeline
                                </Button>
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}