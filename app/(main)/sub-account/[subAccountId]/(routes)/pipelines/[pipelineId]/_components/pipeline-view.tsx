"use client"

import { CustomModal } from "@/components/custom-modal"
import { useModal } from "@/components/providers/modal-provider"
import { Button } from "@/components/ui/button"
import { LaneDetail, PipelineDetailsWithLanesCardsTagsTickets, TicketAndTags } from "@/lib/types"
import { Lane, Ticket } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd"
import { LaneCreateForm } from "./lane-create-form"
import { PipelineLane } from "./pipeline-lane"
import { Flag } from "lucide-react"

interface PipelineViewProps {
    lanes: LaneDetail[]
    pipelineId: string
    subAccountId: string
    pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets
    updateLanesOrder: (lanes: Lane[]) => Promise<void>
    updateTicketOrder: (tickets: Ticket[]) => Promise<void>
}

export const PipelineView = ({
    lanes,
    pipelineId,
    subAccountId,
    pipelineDetails,
    updateLanesOrder,
    updateTicketOrder
}: PipelineViewProps) => {
    const { setOpen } = useModal()
    const router = useRouter()

    const [allLanes, setAllLanes] = useState<LaneDetail[]>([])

    useEffect(() => {
        setAllLanes(lanes)
    }, [lanes])

    const ticketsFromAllLanes: TicketAndTags[] = []

    lanes.forEach((item) => {
        item.Tickets.forEach((i) => {
            ticketsFromAllLanes.push(i)
        })
    })

    const [allTickets, setAllTickets] = useState(ticketsFromAllLanes)

    const handleAddLane = () => {
        setOpen(
            <CustomModal
                title="Create a Line"
                description="Lanes allow you to group tickets"
            >
                <LaneCreateForm 
                    pipelineId={pipelineId}
                />
            </CustomModal>
        )
    }

    return (
        <DragDropContext 
            onDragEnd={() => {}}
        >
            <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl">
                        {pipelineDetails?.name}
                    </h1>
                    <Button
                        className="flex items-center gap-4"
                        onClick={handleAddLane}
                    >
                        Plus Lane
                    </Button>
                </div>
                <Droppable
                    droppableId="lanes"
                    type="lane"
                    direction="horizontal"
                    key="lanes"
                >
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef} 
                            className="flex items-center gap-x-2 overflow-scroll"
                        >
                            <div className="flex mt-4">
                                {allLanes.map((lane, index) => (
                                    <PipelineLane 
                                        allTickets={allTickets}
                                        setAllTickets={setAllTickets}
                                        subAccountId={subAccountId}
                                        pipelineId={pipelineId}
                                        tickets={lane.Tickets}
                                        laneDetails={lane}
                                        index={index}
                                        key={lane.id}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        </div>
                    )}
                </Droppable>
                {allLanes.length === 0 && (
                    <div className="flex items-center justify-center w-full flex-col">
                        <div className="opacity-100">
                            <Flag className="h-4 w-4" />
                        </div>
                    </div>
                )}
            </div>
        </DragDropContext>
    )
}