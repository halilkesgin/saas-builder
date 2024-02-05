import Link from "next/link"

import { Button } from "@/components/ui/button"

export const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-semibold">
                Unauthorized
            </h1>
            <p>
                Please contact support or your agency owner to get access
            </p>
            <Link href="/agency">
                <Button
                    variant="outline"
                    size="sm"
                    >
                    Back to home
                </Button>
            </Link>
        </div>
    )
}