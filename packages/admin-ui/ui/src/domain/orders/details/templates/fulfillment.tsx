import { useTranslation } from "react-i18next"
import IconBadge from "../../../../components/fundamentals/icon-badge"
import BuildingsIcon from "../../../../components/fundamentals/icons/buildings-icon"
import useStockLocations from "../../../../hooks/use-stock-locations"
import { TrackingLink } from "./tracking-link"
import { ClaimOrder, Fulfillment, Swap } from "@medusajs/medusa"

type Props = {
  fulfillmentObj: OrderDetailFulfillment
}

type OrderDetailFulfillment = {
  title: string
  type: string
  fulfillment: Fulfillment
  swap?: Swap
  claim?: ClaimOrder
}

export const FormattedFulfillment = ({ fulfillmentObj }: Props) => {
  const { t } = useTranslation()

  const { getLocationNameById } = useStockLocations()

  const { fulfillment } = fulfillmentObj
  const hasLinks = !!fulfillment.tracking_links?.length

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col space-y-1 py-4">
        <div className="text-grey-90">
          {fulfillment.canceled_at
            ? t(
                "templates-fulfillment-has-been-canceled",
                "Fulfillment has been canceled"
              )
            : "Fullfilment"}
        </div>
        <div className="text-grey-50 flex">
          {!fulfillment.shipped_at
            ? t("templates-not-shipped", "Not shipped")
            : t("templates-tracking", "Tracking")}
          {hasLinks &&
            fulfillment.tracking_links.map((tl, j) => (
              <TrackingLink key={j} trackingLink={tl} />
            ))}
        </div>
        {!fulfillment.canceled_at && fulfillment.location_id && (
          <div className="flex flex-col">
            <div className="text-grey-50 font-semibold">
              {fulfillment.shipped_at
                ? t("templates-shipped-from", "Shipped from")
                : t("templates-shipping-from", "Shipping from")}{" "}
            </div>
            <div className="flex items-center pt-2">
              <IconBadge className="mr-2">
                <BuildingsIcon />
              </IconBadge>
              {getLocationNameById(fulfillment.location_id)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
