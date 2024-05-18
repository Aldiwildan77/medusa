import React from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { useSaveFreeSampleTrackingNumber } from "../freeSampleHooks"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Modal from "../../../components/molecules/modal"
import Input from "../../../components/molecules/input"
import Button from "../../../components/fundamentals/button"
import { TRACKING_CODE_SPLITTER } from "../freeSampleUtils"
import dayjs from "dayjs"

type ShipFreeSampleModalProps = {
  transactionSerial: string
  handleClose: () => void
}

type FormData = {
  trackingNumber?: string
  courierName?: string
}

export const ShipFreeSampleModal: React.FC<ShipFreeSampleModalProps> = ({
  transactionSerial,
  handleClose,
}) => {
  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      trackingNumber: "",
      courierName: "",
    },
    shouldUnregister: true,
  })

  const saveTrackingNumber = useSaveFreeSampleTrackingNumber()

  const isSubmitting = saveTrackingNumber.isLoading

  const notification = useNotification()

  const onSubmit = async (data: FormData) => {
    const now = dayjs().toISOString()
    const trackingNumber = `${data.courierName}${TRACKING_CODE_SPLITTER}${data.trackingNumber}${TRACKING_CODE_SPLITTER}${now}`

    saveTrackingNumber.mutate(
      {
        transactionSerial,
        trackingNumber,
      },
      {
        onSuccess: () => {
          notification(
            t("mark-shipped-success", "Success"),
            "Free sample shipment marked as shipped",
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
            <span className="inter-xlarge-semibold">
              Send Free Sample Shipment
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex flex-col">
              <span className="inter-base-semibold mb-2">
                {t("mark-shipped-tracking", "Tracking")}
              </span>
              <div className="flex flex-col space-y-2">
                <Controller
                  name="courierName"
                  control={control}
                  rules={{
                    shouldUnregister: true,
                    required: {
                      value: true,
                      message: "Courier name is required",
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <div className="flex flex-col">
                        <Input
                          label="Courier name"
                          type="text"
                          placeholder="Courier name, ex: TIKI, JNE, POS"
                          errors={errors}
                          {...field}
                        />
                      </div>
                    )
                  }}
                />
                <Controller
                  name="trackingNumber"
                  control={control}
                  rules={{
                    shouldUnregister: true,
                    required: {
                      value: true,
                      message: "Tracking number is required",
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <div className="flex flex-col">
                        <Input
                          label="Tracking number"
                          type="text"
                          placeholder="Tracking number"
                          errors={errors}
                          {...field}
                        />
                        {/* <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          {errors.courierName?.message}
                        </p> */}
                      </div>
                    )
                  }}
                />
              </div>
            </div>
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
