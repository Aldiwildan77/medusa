import { useTranslation } from "react-i18next"
import StatusDot from "../../../../components/fundamentals/status-indicator"
import { Order } from "@medusajs/medusa"

type Props = {
  status: Order["fulfillment_status"]
}

export const FulfillmentStatusComponent = ({ status }: Props) => {
  const { t } = useTranslation()

  switch (status) {
    case "shipped":
      return <StatusDot title="Shipped" variant="success" />
    case "fulfilled":
    case "not_fulfilled":
      return <StatusDot title="Waiting for shipping" variant="warning" />
    case "canceled":
      return (
        <StatusDot
          title={t("templates-canceled", "Canceled")}
          variant="danger"
        />
      )
    case "partially_fulfilled":
    case "requires_action":
    case "partially_shipped":
    default:
      return <StatusDot title="Unknown status" variant="warning" />
  }
}
