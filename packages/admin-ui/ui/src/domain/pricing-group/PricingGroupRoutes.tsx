import { Route, Routes } from "react-router-dom"
// import { AffiliateIndex } from "./pages/IndexPage"
import { PricingGroupCreatePage } from "./pages/PricingGroupCreatePage"
// import { TargettedCampaignEditPage } from "./pages/TargettedCampaignEditPage"
// import { AffiliateAnalyticsPage } from "./pages/AffiliateAnalyticsPage"

export const PricingGroupRoutes = () => {
  return (
    <Routes>
      {/* <Route index element={<AffiliateIndex />} /> */}
      {/* <Route path="/analytics" element={<AffiliateAnalyticsPage />} /> */}
      <Route path="/create" element={<PricingGroupCreatePage />} />
      {/* <Route
        path="/targetted-campaign/:id"
        element={<TargettedCampaignEditPage />}
      /> */}
    </Routes>
  )
}
