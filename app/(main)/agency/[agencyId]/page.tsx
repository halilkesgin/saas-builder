interface AgencyIdPageProps {
    params: { agencyId: string }
}

const AgencyIdPage = ({
    params
}: AgencyIdPageProps) => {
    return (
        <div>
            {params.agencyId}
        </div>
    )
}

export default AgencyIdPage