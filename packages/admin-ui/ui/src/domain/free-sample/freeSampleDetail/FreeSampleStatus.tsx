import StatusDot from "../../../components/fundamentals/status-indicator"
import { FreeSampleStatus as FreeSampleStatusType } from "../../../types/freeSample"

type Props = {
  status?: FreeSampleStatusType
}

export const FreeSampleStatus = ({ status }: Props) => {
  switch (status) {
    case "COMPLETED":
      return <StatusDot title={"Completed"} variant="success" />
    case "REQUESTED":
      return <StatusDot title="Waiting admin approval" variant="default" />
    case "REJECTED":
      return <StatusDot title="Rejected" variant="danger" />
    case "SHIPPED":
      return <StatusDot title="Shipped" variant="default" />
    case "APPROVED":
      return <StatusDot title="Approved" variant="default" />
    default:
      return <StatusDot title="Unknown" variant="danger" />
  }
}
