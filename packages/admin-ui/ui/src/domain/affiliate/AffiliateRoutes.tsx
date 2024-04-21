import { Route, Routes } from "react-router-dom"
import { AffiliateIndex } from "./index"

export const AffiliateRoutes = () => {
  return (
    <Routes>
      <Route index element={<AffiliateIndex />} />
    </Routes>
  )
}
