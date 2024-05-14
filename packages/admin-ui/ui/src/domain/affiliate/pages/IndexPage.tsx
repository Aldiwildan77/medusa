import { Link } from "react-router-dom"
import { ShopCampaign } from "../ShopCampaign"
import { TargettedCampaignTable } from "../targettedCampaign/TargettedCampaignTable"
import { Button } from "@medusajs/ui"

export function AffiliateIndex() {
  return (
    <div className="gap-y-xsmall flex h-full grow flex-col">
      <div className="flex flex-col gap-4">
        <div className="flex">
          <Link to="/a/affiliate/analytics">
            <Button>See analytics</Button>
          </Link>
        </div>
        <ShopCampaign />
        <TargettedCampaignTable />
      </div>
    </div>
  )
}
