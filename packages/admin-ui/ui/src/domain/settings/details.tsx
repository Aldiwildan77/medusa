import { AdminPostStoreReq, Store } from "@medusajs/medusa"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import BackButton from "../../components/atoms/back-button"
import Input from "../../components/molecules/input"
import BodyCard from "../../components/organisms/body-card"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import { NextSelect } from "../../components/molecules/select/next-select"
import { Option } from "../../types/shared"
import cities from "./rajaongkirCities.json"

type AccountDetailsFormData = {
  name: string
  swap_link_template: string | undefined
  payment_link_template: string | undefined
  invite_link_template: string | undefined
  rajaongkir_courier: Option[] | undefined
  rajaongkir_origin_city_id: Option | undefined
}

const courierListString =
  "jne, pos, tiki, rpx, pandu, wahana, sicepat, jnt, pahala, sap, jet, indah, dse, slis, first, ncs, star, ninja, lion, idl, rex, ide, sentral, anteraja, jtl"
const COURIER_OPTIONS: Option[] = courierListString
  .split(", ")
  .map((courier) => ({
    label: courier.toUpperCase(),
    value: courier,
  }))
const CITY_OPTIONS: Option[] = cities.map((city) => ({
  label: `${city.type} ${city.city_name}`,
  value: city.city_id,
}))

const AccountDetails = () => {
  const { register, reset, handleSubmit, control } =
    useForm<AccountDetailsFormData>()
  const { store } = useAdminStore()
  const { mutate } = useAdminUpdateStore()
  const notification = useNotification()
  const { t } = useTranslation()

  const handleCancel = () => {
    if (store) {
      reset(mapStoreDetails(store))
    }
  }

  useEffect(() => {
    handleCancel()
  }, [store])

  const onSubmit = (data: AccountDetailsFormData) => {
    const validateSwapLinkTemplate = validateUrl(data.swap_link_template)
    const validatePaymentLinkTemplate = validateUrl(data.payment_link_template)
    const validateInviteLinkTemplate = validateUrl(data.invite_link_template)
    const { rajaongkir_courier, rajaongkir_origin_city_id, ...others } = data
    if (!validateSwapLinkTemplate) {
      notification(
        t("settings-error", "Error"),
        t("settings-malformed-swap-url", "Malformed swap url"),
        "error"
      )
      return
    }

    if (!validatePaymentLinkTemplate) {
      notification(
        t("settings-error", "Error"),
        t("settings-malformed-payment-url", "Malformed payment url"),
        "error"
      )
      return
    }

    if (!validateInviteLinkTemplate) {
      notification(
        t("settings-error", "Error"),
        t("settings-malformed-invite-url", "Malformed invite url"),
        "error"
      )
      return
    }

    const payload: AdminPostStoreReq = {
      ...others,
      metadata: {
        rajaongkir_courier: rajaongkir_courier?.map((c) => c.value).join(","),
        rajaongkir_origin_city_id: rajaongkir_origin_city_id?.value,
      },
    }

    mutate(payload, {
      onSuccess: () => {
        notification(
          t("settings-success", "Success"),
          t(
            "settings-successfully-updated-store",
            "Successfully updated store"
          ),
          "success"
        )
      },
      onError: (error) => {
        notification(
          t("settings-error", "Error"),
          getErrorMessage(error),
          "error"
        )
      },
    })
  }

  return (
    <form className="flex-col py-5">
      <div className="max-w-[632px]">
        <BackButton
          path="/a/settings/"
          label={t("settings-back-to-settings", "Back to settings")}
          className="mb-xsmall"
        />
        <BodyCard
          events={[
            {
              label: t("settings-save", "Save"),
              type: "button",
              onClick: handleSubmit(onSubmit),
            },
            {
              label: t("settings-cancel", "Cancel"),
              type: "button",
              onClick: handleCancel,
            },
          ]}
          title={t("settings-store-details", "Store Details")}
          subtitle={t(
            "settings-manage-your-business-details",
            "Manage your business details"
          )}
        >
          <div className="gap-y-xlarge mb-large flex flex-col">
            <div>
              <h2 className="inter-base-semibold mb-base">
                {t("settings-general", "General")}
              </h2>
              <Input
                label={t("settings-store-name", "Store name")}
                {...register("name")}
                placeholder={t("settings-medusa-store", "Medusa Store")}
              />
              <div className="mt-base">
                <Controller
                  name="rajaongkir_courier"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <NextSelect
                        label="Active couriers"
                        onChange={onChange}
                        options={COURIER_OPTIONS}
                        value={value}
                        placeholder="Choose courier..."
                        isClearable
                        isMulti
                        selectAll
                      />
                    )
                  }}
                />
              </div>
              <div className="mt-base">
                <Controller
                  name="rajaongkir_origin_city_id"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <NextSelect
                        label="Origin city of delivery"
                        onChange={onChange}
                        options={CITY_OPTIONS}
                        value={value}
                        placeholder="Choose city..."
                        isClearable
                      />
                    )
                  }}
                />
              </div>
            </div>
            <div>
              <h2 className="inter-base-semibold mb-base">
                {t("settings-advanced-settings", "Advanced settings")}
              </h2>
              <Input
                label={t("settings-swap-link-template", "Swap link template")}
                {...register("swap_link_template")}
                placeholder="https://acme.inc/swap={swap_id}"
              />
              <Input
                className="mt-base"
                label={t(
                  "settings-draft-order-link-template",
                  "Draft order link template"
                )}
                {...register("payment_link_template")}
                placeholder="https://acme.inc/payment={payment_id}"
              />
              <Input
                className="mt-base"
                label={t(
                  "settings-invite-link-template",
                  "Invite link template"
                )}
                {...register("invite_link_template")}
                placeholder="https://acme-admin.inc/invite?token={invite_token}"
              />
            </div>
          </div>
        </BodyCard>
      </div>
    </form>
  )
}

const validateUrl = (address: string | undefined) => {
  if (!address || address === "") {
    return true
  }

  try {
    const url = new URL(address)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (_) {
    return false
  }
}

const mapStoreDetails = (store: Store): AccountDetailsFormData => {
  return {
    name: store.name,
    swap_link_template: store.swap_link_template || "",
    payment_link_template: store.payment_link_template || "",
    invite_link_template: store.invite_link_template || "",
    rajaongkir_courier:
      (store.metadata?.rajaongkir_courier as string)?.split(",").map((c) => ({
        label: c.toUpperCase(),
        value: c,
      })) || [],
    rajaongkir_origin_city_id:
      CITY_OPTIONS?.find(
        (c) => c.value === store.metadata?.rajaongkir_origin_city_id
      ) || undefined,
  }
}

export default AccountDetails
