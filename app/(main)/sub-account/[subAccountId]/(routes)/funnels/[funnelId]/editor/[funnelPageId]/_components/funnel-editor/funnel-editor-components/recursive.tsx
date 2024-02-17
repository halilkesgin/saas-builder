import { EditorElement } from "@/components/providers/editor/editor-provider"
import { TextComponent } from "./text"

interface RecursiveProps {
    element: EditorElement
}

export const Recursive = ({
    element
}: RecursiveProps) => {
    switch (element.type) {
        case "text":
            return <TextComponent element={element} />
        case "container":
            return <Container element={element} />
        case "video":
            return <VideoComponent element={element} />
        case "contactForm":
            return <ContactFormComponent element={element} />
        case "paymentForm":
            return <Checkout element={element} />
        case "2Col":
            return <Container element={element} />
        case "__body":
            return <Container element={element} />
        case "link":
            return <LinkComponent element={element} />
        default:
            return null
    }
}