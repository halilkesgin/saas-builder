import React from "react"
import clsx from "clsx"

interface TagProps {
    title: string
    color: string
    selectedColor?: (color: string) => void
}

export const Tag: React.FC<TagProps> = ({
    color,
    title,
    selectedColor,
}) => {
    return (
        <div
            className={clsx("p-2 rounded-sm flex-shrink-0 text-xs cursor-pointer", {
                "bg-[#57acea]/10 text-[#57acea]": color === "BLUE",
                "bg-[#ffac7e]/10 text-[#ffac7e]": color === "ORANGE",
                "bg-rose-500/10 text-rose-500": color === "ROSE",
                "bg-emerald-400/10 text-emerald-400": color === "GREEN",
                "bg-purple-400/10 text-purple-400": color === "PURPLE",
                "border-[1px] border-[#57acea]": color === "BLUE" && !title,
                "border-[1px] border-[#ffac7e]": color === "ORANGE" && !title,
                "border-[1px] border-rose-500": color === "ROSE" && !title,
                "border-[1px] border-emerald-400": color === "GREEN" && !title,
                "border-[1px] border-purple-400": color === "PURPLE" && !title,
            })}
            key={color}
            onClick={() => {
                if (selectedColor) selectedColor(color)
            }}
        >
            {title}
        </div>
    )
}
