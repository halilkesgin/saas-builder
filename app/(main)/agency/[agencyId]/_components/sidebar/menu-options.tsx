"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { AgencySidebarOption, SubAccount, SubAccountSidebarOption } from "@prisma/client"
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

interface MenuOptionsProps {
    defaultOpen?: boolean
    subAccounts: SubAccount[]
    sidebarOptions: AgencySidebarOption[] | SubAccountSidebarOption[]
    sidebarLogo?: string
    details: any
    user: any
    id: string
}

export const MenuOptions = ({
    defaultOpen,
    subAccounts,
    sidebarOptions,
    sidebarLogo,
    details,
    user,
    id
}: MenuOptionsProps) => {
    const [isMounted, setIsMounted] = useState(false)

    const openState = useMemo(() => (
        defaultOpen ? { open: true } : {}
    ), [defaultOpen])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return

    return (
        <Sheet modal={false} {...openState}>
            <SheetTrigger asChild className="absolute left-4 top-4 z-[100] md:!hidden flex">
                <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent 
                showX={!defaultOpen} 
                side="left" 
                className={cn(
                    "bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
                    defaultOpen && "hidden md:inline-block z-0 w-[300px]",
                    !defaultOpen && "inline-block md:hidden z-[100] w-full"
                )}
            >
                <div>
                    <AspectRatio ratio={16/5}>
                        <Image 
                            src={sidebarLogo || ""}
                            alt="Sidebar logo"
                            fill
                            className="rounded-md object-contain"
                        />
                    </AspectRatio>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="w-full my-4 flex items-center justify-between py-8"
                                variant="ghost"
                            >
                                <div className="flex items-center text-left gap-2">
                                    <Compass />
                                    <div className="flex flex-col">
                                        {details.name}
                                        <span className="text-muted-foreground">
                                            {details.address}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <ChevronsUpDown size="16" className="text-muted-foreground" />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 h-80 mt-4 z-[200]">
                            {
                                <Command className="rounded-lg">
                                    <CommandInput placeholder="Search accounts..." />
                                    <CommandList className="pb-16">
                                        <CommandEmpty>
                                            No results found.
                                        </CommandEmpty>
                                        {(user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") && user?.Agency && (
                                            <CommandGroup heading="Agency">
                                                <CommandItem className="!bg-transparent my-2 text-primary border-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all">
                                                    {defaultOpen ? (
                                                        <Link
                                                            href={`/agency/${user?.Agency?.id}`}
                                                            className="flex gap-4 w-full h-full"
                                                        >
                                                            <div className="relative w-16">
                                                                <Image 
                                                                    src={user?.Agency.agencyLogo || "/assets/plura-logo.svg"}
                                                                    alt="Agency Logo"
                                                                    fill
                                                                    className="object-contain rounded-md"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col flex-1">
                                                                {user?.Agency?.name}
                                                                <span className="text-muted-foreground">
                                                                    {user?.Agency?.address}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    ) : (
                                                        <SheetClose asChild>
                                                            <Link
                                                                href={`/agency/${user?.Agency?.id}`}
                                                                className="flex gap-4 w-full h-full"
                                                            >
                                                                <div className="relative w-16">
                                                                    <Image 
                                                                        src={user?.Agency.agencyLogo || "/assets/plura-logo.svg"}
                                                                        alt="Agency Logo"
                                                                        fill
                                                                        className="object-contain rounded-md"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col flex-1">
                                                                    {user?.Agency?.name}
                                                                    <span className="text-muted-foreground">
                                                                        {user?.Agency?.address}
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                        </SheetClose>
                                                    )}
                                                    
                                                </CommandItem>
                                            </CommandGroup>
                                            
                                        )}
                                        <CommandGroup heading="Accounts">
                                            {!!subAccounts ? subAccounts.map((subAccount) => (
                                                <CommandItem key={subAccount.id}>
                                                    {defaultOpen ? (
                                                        <Link
                                                            href={`/subaccount/${subAccount.id}`}
                                                            className="flex gap-4 w-full h-full"
                                                        >
                                                            <div className="relative w-16">
                                                                <Image
                                                                    src={subAccount.subAccountLogo}
                                                                    alt="subaccount Logo"
                                                                    fill
                                                                    className="rounded-md object-contain"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col flex-1">
                                                                {subAccount.name}
                                                                <span className="text-muted-foreground">
                                                                    {subAccount.address}
                                                                </span>
                                                            </div>
                                                      </Link>
                                                    ) : (
                                                        <SheetClose asChild>
                                                            <Link
                                                                href={`/subaccount/${subAccount.id}`}
                                                                className="flex gap-4 w-full h-full"
                                                            >
                                                                <div className="relative w-16">
                                                                    <Image
                                                                        src={subAccount.subAccountLogo}
                                                                        alt="subaccount Logo"
                                                                        fill
                                                                        className="rounded-md object-contain"
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col flex-1">
                                                                    {subAccount.name}
                                                                    <span className="text-muted-foreground">
                                                                        {subAccount.address}
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                        </SheetClose>
                                                    )}
                                                </CommandItem>
                                                  ))
                                            : "No accounts"}
                                        </CommandGroup>
                                    </CommandList>
                                    {(user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") && (
                                        <Button className="w-full flex gap-2">
                                            <PlusCircleIcon className="h-4 w-4" />
                                            Create Sub Account
                                        </Button>
                                    )}
                                </Command>
                            }
                        </PopoverContent>
                    </Popover>
                </div>
            </SheetContent>
        </Sheet>
    )
}