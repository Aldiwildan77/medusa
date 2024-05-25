import { PricingGroupTable } from "../pricing-groups/pricing-groups-table"
import { Toaster } from "react-hot-toast"

export const AddOnDealPage = () => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <Toaster />
      <PricingGroupTable />
    </div>
  )
}
