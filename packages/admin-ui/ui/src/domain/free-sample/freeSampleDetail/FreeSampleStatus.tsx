import StatusDot from "../../../components/fundamentals/status-indicator"
import { FreeSampleStatus as FreeSampleStatusType } from "../../../types/freeSample"

type Props = {
  status?: FreeSampleStatusType
}

export const FreeSampleStatus = ({ status }: Props) => {
  switch (status) {
    case "REQUESTED":
      return <StatusDot title="Waiting admin approval" variant="default" />
    case "REJECTED":
      return <StatusDot title="Rejected" variant="danger" />
    case "COMPLETED":
    case "SHIPPED":
    case "APPROVED":
      return <StatusDot title="Shipped" variant="default" />
    default:
      return <StatusDot title="Unknown" variant="danger" />
  }
}
