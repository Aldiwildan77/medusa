import { useNavigate, useParams } from "react-router-dom"

import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTranslation } from "react-i18next"
import Avatar from "../../../components/atoms/avatar"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import Tooltip from "../../../components/atoms/tooltip"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon"
import { ActionType } from "../../../components/molecules/actionables"
import BodyCard from "../../../components/organisms/body-card"
import useClipboard from "../../../hooks/use-clipboard"
import useNotification from "../../../hooks/use-notification"
import { isoAlpha2Countries } from "../../../utils/countries"
import PackageIcon from "../../../components/fundamentals/icons/package-icon"
import { ItemsList } from "./ItemsList"
import { useGetFreeSampleDetail } from "../freeSampleHooks"
import dayjs from "dayjs"
import { XMark } from "@medusajs/icons"
import { ShipFreeSampleModal } from "./ShipFreeSampleModal"
import { FreeSampleStatus } from "./FreeSampleStatus"
import { FormattedAddress } from "../../orders/details/templates"
import { Address } from "@medusajs/medusa"
import Button from "../../../components/fundamentals/button"
import { TRACKING_CODE_SPLITTER } from "../freeSampleUtils"

export const FreeSampleDetailPage = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const [showFulfillmentShipment, setShowFulfillmentShipment] = useState(false)

  const { data, isFetching, refetch } = useGetFreeSampleDetail(
    {
      serial: id || "",
    },
    {
      enabled: !!id,
    }
  )

  const navigate = useNavigate()
  const notification = useNotification()

  const [, handleCopy] = useClipboard(`${data?.serial || ""}`, {
    successDuration: 5500,
    onCopied: () =>
      notification(
        t("details-success", "Success"),
        t("details-order-id-copied", "Serial copied"),
        "success"
      ),
  })

  const [, handleCopyEmail] = useClipboard(data?.customer?.email || "", {
    successDuration: 5500,
    onCopied: () =>
      notification(
        t("details-success", "Success"),
        t("details-email-copied", "Email copied"),
        "success"
      ),
  })

  useHotkeys("esc", () => navigate("/a/free-sample"))

  const customerActionables: ActionType[] = [
    {
      label: t("details-go-to-customer", "Go to Customer"),
      icon: <DetailsIcon size={"20"} />,
      onClick: () =>
        window.open(
          `/a/customers/${data?.customer.id}`,
          "_blank",
          "rel=noopener noreferrer"
        ),
    },
  ]

  if (isFetching || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="small" variant="secondary" />
      </div>
    )
  }

  if (!isFetching && !data) {
    navigate("/a/free-sample")
  }

  const [courierName, courierTrackingNumber, courierShippedAt] = (
    data?.tracking_code || ""
  ).split(TRACKING_CODE_SPLITTER)

  const handleCopyTrackingNumber = () => {
    navigator.clipboard.writeText(courierTrackingNumber)
    alert("Tracking number copied to clipboard")
  }

  type CountryCode = keyof typeof isoAlpha2Countries
  const countryCode = (data?.shipping?.country_code?.toUpperCase() ||
    "") as CountryCode
  const countryCodeFull = isoAlpha2Countries?.[countryCode]

  return (
    <div className="flex flex-col">
      <BackButton
        path="/a/free-sample"
        label="Back to Free Sample List"
        className="mb-xsmall"
      />
      <div className="gap-y-base flex h-full w-full flex-col">
        <BodyCard
          compact={true}
          className={"min-h-[200px] w-full"}
          customHeader={
            <Tooltip side="top" content={"Copy Serial"}>
              <button
                className="inter-xlarge-semibold text-grey-90 active:text-violet-90 flex cursor-pointer items-center gap-x-2"
                onClick={handleCopy}
              >
                {data?.serial} <ClipboardCopyIcon size={16} />
              </button>
            </Tooltip>
          }
          subtitle={dayjs(data?.transaction_date).format("D MMMM YYYY HH:mm")}
          status={<FreeSampleStatus status={data?.status} />}
          forceDropdown={false}
        >
          <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-6">
            <div className="flex flex-col">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("details-email", "Email")}
              </div>
              <button
                className="text-grey-90 active:text-violet-90 flex cursor-pointer items-center gap-x-1"
                onClick={handleCopyEmail}
              >
                {data?.customer?.email || "-"}
                <ClipboardCopyIcon size={12} />
              </button>
            </div>
            <div className="flex flex-col">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                {t("details-phone", "Phone")}
              </div>
              <div>{data?.customer?.phone || "-"}</div>
            </div>
          </div>
        </BodyCard>

        <ItemsList items={data?.items || []} />

        <BodyCard
          compact={true}
          className={"h-auto min-h-0 w-full"}
          title={"Shipment"}
          status={
            data?.status !== "SHIPPED" ? "Waiting for shipment" : "Shipped"
          }
        >
          <div className="inter-small-regular">
            {data?.status === "REQUESTED" && (
              <div className="flex w-full justify-end">
                <div className="flex flex-row gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    type="button"
                    className="flex items-center"
                    onClick={() => console.log("Decline Request")}
                  >
                    <div className="gap-x-2xsmall flex items-center">
                      <XMark width={20} height={20} />
                      Decline Request
                    </div>
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    type="button"
                    className="flex items-center"
                    onClick={() => setShowFulfillmentShipment(true)}
                  >
                    <div className="gap-x-2xsmall flex items-center">
                      <PackageIcon width={20} height={20} />
                      Send Shipment
                    </div>
                  </Button>
                </div>
              </div>
            )}
            {data?.status === "SHIPPED" && (
              <div className="flex w-full flex-col">
                <div className="grid grid-cols-12">
                  <div className="text-grey-50 col-span-2">Courier</div>
                  <div className="col-span-10">{courierName || "-"}</div>
                </div>
                <div className="grid grid-cols-12">
                  <div className="text-grey-50 col-span-2">Tracking Number</div>
                  <div
                    className="col-span-10 inline-flex cursor-pointer flex-row items-center gap-1 font-semibold text-blue-50"
                    onClick={handleCopyTrackingNumber}
                  >
                    {courierTrackingNumber || "-"}{" "}
                    <ClipboardCopyIcon size={16} />
                  </div>
                </div>
                <div className="grid grid-cols-12">
                  <div className="text-grey-50 col-span-2">Shipped At</div>
                  <div className="col-span-10">
                    {dayjs(courierShippedAt).format("D MMMM YYYY HH:mm") || "-"}
                  </div>
                </div>

                {/* <div className="flex flex-col space-y-1 py-4">
                  <div className="text-grey-50 flex">
                    {data?.tracking_code
                      ? dayjs(courierShippedAt).format("D MMMM YYYY HH:mm")
                      : "Not Shipped"}
                    {data?.tracking_code ? (
                      <span
                        className="text-blue-60 ml-2 inline-flex cursor-pointer flex-row items-center gap-1 font-semibold"
                        onClick={handleCopyTrackingNumber}
                      >
                        {courierName} {courierTrackingNumber}{" "}
                        <ClipboardCopyIcon />
                      </span>
                    ) : null}
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </BodyCard>
        <BodyCard
          compact={true}
          className={"h-auto min-h-0 w-full"}
          title="Customer"
          actionables={customerActionables}
        >
          <div className="mt-6">
            <div className="flex w-full items-center space-x-4">
              <div className="flex h-[40px] w-[40px] ">
                <Avatar
                  user={data?.customer}
                  font="inter-large-semibold"
                  color="bg-fuschia-40"
                />
              </div>
              <div>
                <h1 className="inter-large-semibold text-grey-90">
                  {data?.customer?.first_name} {data?.customer?.last_name}
                </h1>
                {data?.shipping && (
                  <span className="inter-small-regular text-grey-50">
                    {data?.shipping.city},{" "}
                    {data?.shipping?.country_code ? countryCodeFull : ""}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 flex space-x-6 divide-x">
              <div className="flex flex-col">
                <div className="inter-small-regular text-grey-50 mb-1">
                  {t("details-contact", "Contact")}
                </div>
                <div className="inter-small-regular flex flex-col">
                  <span>{data?.customer?.email}</span>
                  <span>{data?.shipping?.phone || ""}</span>
                </div>
              </div>
              <FormattedAddress
                title={t("details-shipping", "Shipping")}
                addr={data?.shipping as Address}
              />
            </div>
          </div>
        </BodyCard>
      </div>
      {showFulfillmentShipment && (
        <ShipFreeSampleModal
          handleClose={() => {
            setShowFulfillmentShipment(false)
            refetch()
          }}
          transactionSerial={data?.serial}
        />
      )}
    </div>
  )
}
