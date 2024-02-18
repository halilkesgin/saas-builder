"use client"

import { ProgressCircle } from "@tremor/react"
import { ReactNode } from "react"

interface Props {
    value: number
    description: ReactNode
}

export const CircleProgress = ({
    description,
    value = 0
}: Props) => {
    return (
        <div className="flex gap-4 items-center">
            <ProgressCircle
                showAnimation={true}
                value={value}
                radius={70}
                strokeWidth={20}
            >
                {value}%
            </ProgressCircle>
            <div>
                <b>Closing Rate</b>
                <p className="text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    )
}