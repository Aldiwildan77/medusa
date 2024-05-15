import { Route, Routes } from "react-router-dom"
import { FreeSampleListPage } from "./FreeSampleListPage"

export const FreeSampleRoutes = () => {
  return (
    <Routes>
      <Route index element={<FreeSampleListPage />} />
      {/* <Route
        path="/targetted-campaign/:id"
        element={<TargettedCampaignEditPage />}
      /> */}
    </Routes>
  )
}
