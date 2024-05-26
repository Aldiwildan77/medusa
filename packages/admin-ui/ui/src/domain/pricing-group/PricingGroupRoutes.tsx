import { Route, Routes } from "react-router-dom"
import { PricingGroupCreatePage } from "./pages/PricingGroupCreatePage"
import { PricingGroupIndex } from "./pages/IndexPage"

export const PricingGroupRoutes = () => {
  return (
    <Routes>
      <Route index element={<PricingGroupIndex />} />
      <Route path="/create" element={<PricingGroupCreatePage />} />
      {/* <Route
        path="/targetted-campaign/:id"
        element={<TargettedCampaignEditPage />}
      /> */}
    </Routes>
  )
}
