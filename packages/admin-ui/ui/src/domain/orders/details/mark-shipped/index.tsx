import {
  AdminPostOrdersOrderFulfillmentsReq,
  AdminPostOrdersOrderShipmentReq,
  Fulfillment,
  Order,
} from "@medusajs/medusa"
import {
  useAdminCreateClaimShipment,
  useAdminCreateFulfillment,
  useAdminCreateShipment,
  useAdminCreateSwapShipment,
} from "medusa-react"
import React, { useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { getFulfillableQuantity } from "../create-fulfillment/item-table"
import { isDefined } from "../../../../utils/is-defined"
import { useManualEnrollmentAffiliateTransaction } from "../../../affiliate/affiliateHooks"

type MarkShippedModalProps = {
  orderId: string
  handleClose: () => void
  orderToFulfill: Order
}

type MarkShippedFormData = {
  tracking_numbers: {
    value: string | undefined
  }[]
}

const MarkShippedModal: React.FC<MarkShippedModalProps> = ({
  orderId,
  handleClose,
  orderToFulfill,
}) => {
  const { t } = useTranslation()
  const { control, watch, handleSubmit } = useForm<MarkShippedFormData>({
    defaultValues: {
      tracking_numbers: [{ value: "" }],
    },
    shouldUnregister: true,
  })

  const { fields } = useFieldArray({
    control,
    name: "tracking_numbers",
  })

  const watchedFields = watch("tracking_numbers")

  // Allows us to listen to onChange events
  const trackingNumbers = fields.map((field, index) => ({
    ...field,
    ...watchedFields[index],
  }))

  const createOrderFulfillment = useAdminCreateFulfillment(orderId)
  const markOrderShipped = useAdminCreateShipment(orderId)
  const manualEnrollment = useManualEnrollmentAffiliateTransaction()
  // const markSwapShipped = useAdminCreateSwapShipment(orderId)
  // const markClaimShipped = useAdminCreateClaimShipment(orderId)

  const isSubmitting =
    markOrderShipped.isLoading ||
    createOrderFulfillment.isLoading ||
    manualEnrollment.isLoading

  const notification = useNotification()

  const onSubmit = async (data: MarkShippedFormData) => {
    const quantities = (orderToFulfill as Order).items.reduce((acc, next) => {
      return {
        ...acc,
        [next.id]: getFulfillableQuantity(next),
      }
    }, {}) as Record<string, number>

    const createFulfillmentReq: AdminPostOrdersOrderFulfillmentsReq = {
      no_notification: false,
      items: Object.entries(quantities)
        .filter(([, value]) => !!value)
        .map(([key, value]) => ({
          item_id: key,
          quantity: value,
        })),
    }

    const createdFulfillment = await createOrderFulfillment.mutateAsync(
      createFulfillmentReq
    )

    const tracking_numbers = data.tracking_numbers
      .map((tn) => tn.value)
      .filter(isDefined)

    const successText = t(
      "mark-shipped-successfully-marked-order-as-shipped",
      "Successfully marked order as shipped"
    )
    const shipOrderReq: AdminPostOrdersOrderShipmentReq = {
      fulfillment_id: createdFulfillment?.order?.fulfillments?.[0]?.id || "",
      tracking_numbers,
      no_notification: false,
    }

    markOrderShipped.mutateAsync(shipOrderReq)
    manualEnrollment.mutate(
      { orderId },
      {
        onSuccess: () => {
          notification(
            t("mark-shipped-success", "Success"),
            successText,
            "success"
          )
          handleClose()
        },
        onError: (err) =>
          notification(
            t("mark-shipped-error", "Error"),
            getErrorMessage(err),
            "error"
          ),
      }
    )
  }

  return (
    <Modal handleClose={handleClose} isLargeModal>
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log(errors)
        })}
      >
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">Send Shipment</span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex flex-col">
              <span className="inter-base-semibold mb-2">
                {t("mark-shipped-tracking", "Tracking")}
              </span>
              <div className="flex flex-col space-y-2">
                {trackingNumbers.map((tn, index) => (
                  <Controller
                    key={tn.id}
                    name={`tracking_numbers.${index}.value`}
                    control={control}
                    rules={{
                      shouldUnregister: true,
                    }}
                    render={({ field }) => {
                      return (
                        <Input
                          label={
                            index === 0
                              ? t(
                                  "mark-shipped-tracking-number-label",
                                  "Tracking number"
                                )
                              : ""
                          }
                          type="text"
                          placeholder={t(
                            "mark-shipped-tracking-number",
                            "Tracking number..."
                          )}
                          {...field}
                        />
                      )
                    }}
                  />
                ))}
              </div>
            </div>
            {/* <div className="mt-4 flex w-full justify-end">
              <Button
                size="small"
                onClick={() => appendTracking({ value: undefined })}
                variant="secondary"
                disabled={trackingNumbers.some((tn) => !tn.value)}
              >
                {t(
                  "mark-shipped-add-additional-tracking-number",
                  "+ Add Additional Tracking Number"
                )}
              </Button>
            </div> */}
          </Modal.Content>
          <Modal.Footer>
            <div className="flex h-8 w-full justify-end">
              <div className="flex">
                <Button
                  variant="ghost"
                  className="text-small mr-2 w-32 justify-center"
                  size="large"
                  onClick={handleClose}
                  type="button"
                >
                  {t("mark-shipped-cancel", "Cancel")}
                </Button>
                <Button
                  size="large"
                  className="text-small w-32 justify-center"
                  variant="primary"
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {t("mark-shipped-complete", "Complete")}
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default MarkShippedModal
