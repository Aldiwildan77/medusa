import { FieldErrors, UseFormSetValue } from "react-hook-form"
import BodyCard from "../../../../components/organisms/body-card"
import { TargettedCampaignFormType } from "./targettedCampaignSchema"
import { AffiliateProductTargetAll } from "./AffiliateProductTargetAll"
import { AffiliateProductTargetProduct } from "./AffiliateProductTargetProduct"

type Props = {
  errors: Partial<FieldErrors<TargettedCampaignFormType>>
  setValue: UseFormSetValue<TargettedCampaignFormType>
  values: TargettedCampaignFormType
}

export function AffiliateProductTarget(props: Props) {
  return (
    <BodyCard
      forceDropdown={false}
      compact={true}
      title="Select Products"
      className="h-fit"
    >
      <div className="flex flex-col gap-3">
        <ProductTargetType {...props} />
        {props.values?.productTargetType === "ALL" && (
          <AffiliateProductTargetAll {...props} />
        )}
        {props.values?.productTargetType === "PRODUCT" && (
          <AffiliateProductTargetProduct {...props} />
        )}
      </div>
    </BodyCard>
  )
}

function ProductTargetType(props: Props) {
  return (
    <div className="flex flex-col gap-2">
      <ul className="grid w-full grid-cols-2 gap-4">
        <li>
          <label
            htmlFor="productTargetTypeAll"
            className="flex w-full cursor-pointer flex-row items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:text-blue-600"
          >
            <input
              type="radio"
              id="productTargetTypeAll"
              name="productTargetType"
              className="peer"
              checked={props.values?.productTargetType === "ALL"}
              onChange={() => props.setValue("productTargetType", "ALL")}
            />
            <div className="grow">
              <div className="w-full text-lg font-semibold">All Products</div>
              <div className="w-full">All products will be promoted</div>
            </div>
          </label>
        </li>
        <li>
          <label
            htmlFor="productTargetTypeProduct"
            className="flex w-full cursor-pointer flex-row items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:text-blue-600"
          >
            <input
              type="radio"
              id="productTargetTypeProduct"
              name="productTargetType"
              className="peer"
              checked={props.values?.productTargetType === "PRODUCT"}
              onChange={() => props.setValue("productTargetType", "PRODUCT")}
            />
            <div className="grow">
              <div className="w-full text-lg font-semibold">
                Specific Products
              </div>
              <div className="w-full">
                Only specific products will be promoted
              </div>
            </div>
          </label>
        </li>
      </ul>
      {props.errors.productTargetType && (
        <span className="col-span-2 text-sm  text-red-700">
          {props.errors.productTargetType.message}
        </span>
      )}
    </div>
  )
}
