import { EditorButtons } from "@/lib/constants"
import { Link2Icon, TypeIcon } from "lucide-react"
import React from "react"

export const LinkPlaceholder = () => {
    const handleDragStart = (e: React.DragEvent, type: EditorButtons) => {
        if (type === null) return
        e.dataTransfer.setData("componentType", type)
    }
  
    return (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, "link")}
            className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
        >
            <Link2Icon
                size={40}
                className="text-muted-foreground"
            />
        </div>
    )
}