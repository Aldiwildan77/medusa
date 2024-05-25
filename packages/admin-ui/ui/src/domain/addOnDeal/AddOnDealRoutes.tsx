import { Route, Routes } from "react-router-dom"
import { AddOnDealDetailPage } from "./pages/AddOnDealDetailPage"
import { AddOnDealPage } from "./pages/AddOnDealPage"

export const AddOnDealRoutes = () => {
  return (
    <Routes>
      <Route index element={<AddOnDealPage />} />
      <Route path="/:id" element={<AddOnDealDetailPage />} />
    </Routes>
  )
}
