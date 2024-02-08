import { Loader2 } from "lucide-react"

const LoadingAgencyPage = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <Loader2 className="h-4 w-4 animate-spin" />
        </div>
    )
}

export default LoadingAgencyPage