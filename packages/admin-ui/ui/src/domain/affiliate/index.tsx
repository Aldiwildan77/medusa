import { ShopCampaign } from "./ShopCampaign"
import { TargettedCampaignTable } from "./targettedCampaign/TargettedCampaignTable"

export function AffiliateIndex() {
  return (
    <div className="gap-y-xsmall flex h-full grow flex-col">
      <div className="flex flex-col gap-4">
        <ShopCampaign />
        <TargettedCampaignTable />
      </div>
    </div>
  )
}
