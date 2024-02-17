import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Plus, Settings2, SquareStackIcon } from "lucide-react"

export const TabList = () => {
    return (
        <TabsList className="flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4">
            <TabsTrigger
                value="Settings"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
                <Settings2 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger
                value="Components"
                className="data-[state=active]:bg-muted w-10 h-10 p-0"
            >
                <Plus className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger
                value="Layers"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
                <SquareStackIcon className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger
                value="Media"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
                <Database className="h-4 w-4" />
            </TabsTrigger>
        </TabsList>
    )
}