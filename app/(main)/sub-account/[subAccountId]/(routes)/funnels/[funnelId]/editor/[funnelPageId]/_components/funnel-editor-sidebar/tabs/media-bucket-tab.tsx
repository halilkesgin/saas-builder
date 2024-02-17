"use client"

import { Media } from "@/components/media"
import { getMedia } from "@/lib/queries"
import { GetMediaFiles } from "@/lib/types"
import React, { useEffect, useState } from "react"

type Props = {
    subAccountId: string
}

export const MediaBucketTab = ({
    subAccountId
}: Props) => {
    const [data, setdata] = useState<GetMediaFiles>(null)

    useEffect(() => {
        const fetchData = async () => {
            const response = await getMedia(subAccountId)
            setdata(response)
        }
        fetchData()
    }, [subAccountId])

    return (
        <div className="h-[900px] overflow-scroll p-4">
            <Media
                data={data}
                subAccountId={subAccountId}
            />
        </div>
    )
}
