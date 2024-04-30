import { Route, Routes } from "react-router-dom"
import { AffiliateIndex } from "./pages/IndexPage"
import { TargettedCampaignCreatePage } from "./pages/TargettedCampaignCreatePage"
import { TargettedCampaignEditPage } from "./pages/TargettedCampaignEditPage"

export const AffiliateRoutes = () => {
  return (
    <Routes>
      <Route index element={<AffiliateIndex />} />
      <Route
        path="/targetted-campaign/create"
        element={<TargettedCampaignCreatePage />}
      />
      <Route
        path="/targetted-campaign/:id"
        element={<TargettedCampaignEditPage />}
      />
    </Routes>
  )
}
