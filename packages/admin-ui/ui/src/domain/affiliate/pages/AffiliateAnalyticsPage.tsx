import { AffiliateAnalytics } from "../AffiliateAnalytics"
import { AffiliatorAnalytics } from "../affiliateAnalytics/AffiliatorAnalytics"

export function AffiliateAnalyticsPage() {
  return (
    <div className="gap-y-xsmall flex h-full grow flex-col">
      <div className="flex flex-col gap-4">
        <AffiliateAnalytics />
        <AffiliatorAnalytics />
      </div>
    </div>
  )
}
