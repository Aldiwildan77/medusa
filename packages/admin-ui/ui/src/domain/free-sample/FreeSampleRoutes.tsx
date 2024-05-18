import { Route, Routes } from "react-router-dom"
import { FreeSampleListPage } from "./FreeSampleListPage"
import { FreeSampleDetailPage } from "./freeSampleDetail/FreeSampleDetailPage"

export const FreeSampleRoutes = () => {
  return (
    <Routes>
      <Route index element={<FreeSampleListPage />} />
      <Route path="/:id" element={<FreeSampleDetailPage />} />
    </Routes>
  )
}
