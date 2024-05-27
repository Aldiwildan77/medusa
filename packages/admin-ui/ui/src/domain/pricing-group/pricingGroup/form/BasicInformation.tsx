import BodyCard from "../../../../components/organisms/body-card"
import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { PricingGroupFormType } from "./pricingGroupSchema"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

type Props = {
  errors: Partial<FieldErrors<PricingGroupFormType>>
  setValue: UseFormSetValue<PricingGroupFormType>
  values: PricingGroupFormType
}

export function BasicInformation(props: Props) {
  return (
    <BodyCard
      forceDropdown={false}
      compact={true}
      title="Basic information"
      className="h-fit"
    >
      {/* TODO: add back button to affiliate home page */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-12 gap-2">
          <label
            htmlFor="name"
            className="col-span-2 mt-2 block text-right text-sm font-medium"
          >
            Name <span className=" text-red-700">*</span>
          </label>
          <div className="col-span-8 flex flex-col gap-1">
            <input
              name="name"
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
              placeholder="Please enter a campaign name"
              required
              value={props.values.name}
              onChange={(e) => props.setValue("name", e.target.value)}
            />
            <span className="col-span-2 text-sm text-gray-400">
              Add-on name is not visible to customers
            </span>
            {props.errors.name && (
              <span className="col-span-2 text-sm  text-red-700">
                {props.errors.name.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <label
            htmlFor="limitPurchase"
            className="col-span-2 mt-2 block text-right text-sm font-medium"
          >
            Purchase Limit <span className=" text-red-700">*</span>
          </label>
          <div className="col-span-8 flex flex-col gap-1">
            <input
              name="limitPurchase"
              type="number"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 "
              placeholder="Enter the purchase limit"
              required
              value={props.values.limitPurchase}
              onChange={(e) =>
                props.setValue("limitPurchase", Number(e.target.value))
              }
            />
            <span className="col-span-2 text-sm text-gray-400">
              Max. number of add-on products a customer can purchase
            </span>
            {props.errors.limitPurchase && (
              <span className="col-span-2 text-sm  text-red-700">
                {props.errors.limitPurchase.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <label
            htmlFor="limitPurchase"
            className="col-span-2 block text-right text-sm font-medium"
          >
            Is active?
          </label>
          <div className="col-span-8 flex flex-col gap-1">
            <input
              name="isActive"
              checked={props.values.isActive}
              onChange={(e) => props.setValue("isActive", e.target.checked)}
              id="checkbox-1"
              type="checkbox"
              value=""
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />

            {props.errors.isActive && (
              <span className="col-span-2 text-sm  text-red-700">
                {props.errors.isActive.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </BodyCard>
  )
}
