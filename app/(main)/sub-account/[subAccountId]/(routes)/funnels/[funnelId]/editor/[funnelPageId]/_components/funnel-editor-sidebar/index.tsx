"use client"

import { useEditor } from "@/components/providers/editor/editor-provider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { TabList } from "./tabs"
import { SettingsTab } from "./tabs/settings-tab"
import { MediaBucketTab } from "./tabs/media-bucket-tab"
import { ComponentsTab } from "./tabs/components-tab"

interface Props {
    subAccountId: string
}

export const FunnelEditorSidebar = ({
    subAccountId
}: Props) => {
    const { state, dispatch } = useEditor()

    return (
        <Sheet
            open={true}
            modal={false}
        >
            <Tabs
                className="w-full"
                defaultValue="Settings"
            >
                <SheetContent
                    showX={false}
                    side="right"
                    className={cn(
                        "mt-[97px] w-16 z-[80] shadow-none p-0 focus:border-none transition-all overflow-hidden",
                        state.editor.previewMode && "hidden"
                    )}
                >
                    <TabList />
                </SheetContent>
                <SheetContent
                    showX={false}
                    side="right"
                    className={cn(
                        "mt-[97px] w-80 z-[40] shadow-none p-0 mr-16 bg-background h-full transition-all overflow-hidden",
                        state.editor.previewMode && "hidden"
                    )}
                >
                    <div className="grid gap-4 h-full pb-36 overflow-scroll">
                        <TabsContent value="Settings">
                            <SheetHeader className="text-left p-6">
                                <SheetTitle>
                                    Styles
                                </SheetTitle>
                                <SheetDescription>
                                    Show your creativity! You can customize every component as you like.
                                </SheetDescription>
                            </SheetHeader>
                            <SettingsTab />
                        </TabsContent>
                        <TabsContent value="Media">
                            <MediaBucketTab subAccountId={subAccountId} />
                        </TabsContent>
                        <TabsContent value="Components">
                            <SheetHeader>
                                <SheetTitle>
                                    Components
                                </SheetTitle>
                                <SheetDescription>
                                    You can drag and drop components on the canvas
                                </SheetDescription>
                            </SheetHeader>
                            <ComponentsTab />
                        </TabsContent>
                    </div>
                </SheetContent>
            </Tabs>
        </Sheet>
    )
}