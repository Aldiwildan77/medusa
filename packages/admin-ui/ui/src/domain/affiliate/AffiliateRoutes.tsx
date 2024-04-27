import { Route, Routes } from "react-router-dom"
import { AffiliateIndex } from "./pages/IndexPage"
import { TargettedCampaignCreatePage } from "./pages/TargettedCampaignCreatePage"

export const AffiliateRoutes = () => {
  return (
    <Routes>
      <Route index element={<AffiliateIndex />} />
      <Route
        path="/targetted-campaign/create"
        element={<TargettedCampaignCreatePage />}
      />
    </Routes>
  )
}
