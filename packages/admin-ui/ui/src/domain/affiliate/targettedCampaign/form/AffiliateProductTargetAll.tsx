import { FieldErrors, UseFormSetValue } from "react-hook-form"
import { TargettedCampaignFormType } from "./targettedCampaignSchema"

type Props = {
  errors: Partial<FieldErrors<TargettedCampaignFormType>>
  setValue: UseFormSetValue<TargettedCampaignFormType>
  values: TargettedCampaignFormType
}

export function AffiliateProductTargetAll(props: Props) {
  return (
    <div className="flex flex-col gap-2 bg-gray-100 p-4">
      <div className="flex flex-col gap-0">
        <p className="text-sm font-medium">
          Set commission rate for all products
        </p>
        <p className="text-sm">
          This will include all new products added in the future.
        </p>
      </div>
      <div className="grid grid-cols-12 items-center gap-2">
        <label htmlFor="name" className="col-span-2 block text-sm font-medium">
          Commission Rate <span className=" text-red-700">*</span>
        </label>
        <div className="col-span-3 flex flex-col gap-1">
          <div className="relative flex flex-row">
            <input
              name="name"
              type="number"
              className="block w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.5 - 80"
              style={{
                borderStartStartRadius: "0.5rem",
                borderEndStartRadius: "0.5rem",
              }}
              required
              value={props.values?.productTargetSingleCommissionRate}
              onChange={(e) =>
                props.setValue(
                  "productTargetSingleCommissionRate",
                  Number(e.target.value)
                )
              }
            />
            <div
              className="inline-flex items-center rounded-r-lg bg-gray-200 px-2 text-sm text-gray-900"
              style={{
                insetInlineEnd: 0,
                borderEndEndRadius: "0.5rem",
                borderStartEndRadius: "0.5rem",
              }}
            >
              %
            </div>
          </div>
          {props.errors.name && (
            <span className="col-span-2 text-sm text-red-700">
              {props.errors.name.message}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
