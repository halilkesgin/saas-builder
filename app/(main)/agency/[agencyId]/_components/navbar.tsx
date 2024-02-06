"use client"

import { UserButton } from "@clerk/nextjs"
import { Bell } from "lucide-react"
import { useState } from "react"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NotificationWithUser } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Role } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"

interface NavbarProps {
    notifications: NotificationWithUser | []
    role?: Role
    className?: string
    subAccountId?: string
}

export const Navbar = ({
    notifications,
    role,
    className,
    subAccountId
}: NavbarProps) => {

    const [allNotifications, setAllNotifications] = useState(notifications)
    const [showAll, setShowAll] = useState(true)

    const handleClick = () => {
        if (!showAll) {
            setAllNotifications(notifications)
        } else {
            if (notifications?.length !== 0) {
                setAllNotifications(notifications?.filter((item) => item.subAccountId === subAccountId) ?? [])
            }
        }
        setShowAll((prev) => !prev)
    }

    return (
        <>
            <div className={cn(
                "fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]",
                className
            )}>
                <div className="flex items-center gap-2 ml-auto">
                    <UserButton afterSignOutUrl="/" />
                    <Sheet>
                        <SheetTrigger>
                            <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white">
                                <Bell className="h-4 w-4" />
                            </div>
                        </SheetTrigger>
                        <SheetContent className="mt-4 mr-4 pr-4 flex flex-col">
                            <SheetHeader className="text-left">
                                <SheetTitle>
                                    Notifications
                                </SheetTitle>
                                <SheetDescription>
                                    {(role === "AGENCY_ADMIN" || role === "AGENCY_OWNER") && (
                                        <Card className="flex items-center justify-between p-4">
                                            Current Sub Account
                                            <Switch 
                                                onChangeCapture={handleClick}
                                            />
                                        </Card>
                                    )}
                                </SheetDescription>
                            </SheetHeader>
                            {allNotifications?.map((notification) => (
                                <div key={notification.id} className="flex flex-col gap-y-2 mb-2 overflow-x-scroll text-ellipsis">
                                    <div className="flex gap-3">
                                        <Avatar>
                                            <AvatarImage 
                                                src="/shadcn.png"
                                                alt="Avatar"
                                            />
                                            <AvatarFallback className="bg-primary">
                                                {notification.User.name.slice(0,2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p>
                                                <span className="font-bold">
                                                    {notification.notification.split("|")[0]}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {notification.notification.split("|")[1]}
                                                </span>
                                                <span className="font-bold">
                                                    {notification.notification.split("|")[2]}
                                                </span>
                                            </p>
                                            <small className="text-xs text-muted-foreground">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {allNotifications?.length === 0 && (
                                <div className="flex items-center justify-center">
                                    You have no notifications
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                    <ModeToggle />
                </div>
            </div>
        </>
    )
}