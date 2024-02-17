import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { EditorButtons } from "@/lib/constants"
import React from "react"
import { TextPlaceholder } from "./text-placeholder"
import { ContainerPlaceholder } from "./container-placeholder"
import { VideoPlaceholder } from "./video-placeholder"
import { TwoColumnsPlaceholder } from "./two-columns-placeholder"
import { LinkPlaceholder } from "./link-placeholder"
import { ContactFormPlaceholder } from "./contact-form-placeholder"
import { CheckoutPlaceholder } from "./checkout-placeholder"

export const ComponentsTab = () => {
    const elements: {
        Component: React.ReactNode
        label: string
        id: EditorButtons
        group: "layout" | "elements"
    }[] = [
        {
            Component: <TextPlaceholder />,
            label: "Text",
            id: "text",
            group: "elements",
        },
        {
            Component: <ContainerPlaceholder />,
            label: "Container",
            id: "container",
            group: "layout",
        },
        {
            Component: <TwoColumnsPlaceholder />,
            label: "2 Columns",
            id: "2Col",
            group: "layout",
        },
        {
            Component: <VideoPlaceholder />,
            label: "Video",
            id: "video",
            group: "elements",
        },
        {
            Component: <ContactFormPlaceholder />,
            label: "Contact",
            id: "contactForm",
            group: "elements",
        },
        {
            Component: <CheckoutPlaceholder />,
            label: "Checkout",
            id: "paymentForm",
            group: "elements",
        },
        {
            Component: <LinkPlaceholder />,
            label: "Link",
            id: "link",
            group: "elements",
        },
    ]

    return (
        <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["Layout", "Elements"]}
        >
            <AccordionItem
                value="Layout"
                className="px-6 py-0 border-y-[1px]"
            >
                <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
                <AccordionContent className="flex flex-wrap gap-2">
                    {elements
                        .filter((element) => element.group === "layout")
                        .map((element) => (
                            <div
                                key={element.id}
                                className="flex-col items-center justify-center flex"
                            >
                                {element.Component}
                                <span className="text-muted-foreground">{element.label}</span>
                            </div>
                        ))
                    }
                </AccordionContent>
            </AccordionItem>
            <AccordionItem
                value="Elements"
                className="px-6 py-0 "
            >
                <AccordionTrigger className="!no-underline">Elements</AccordionTrigger>
                <AccordionContent className="flex flex-wrap gap-2 ">
                    {elements
                        .filter((element) => element.group === "elements")
                        .map((element) => (
                            <div
                                key={element.id}
                                className="flex-col items-center justify-center flex"
                            >
                                {element.Component}
                                <span className="text-muted-foreground">{element.label}</span>
                             </div>
                        ))
                    }
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}