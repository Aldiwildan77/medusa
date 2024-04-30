import { useState } from "react"
import EditIcon from "../../components/fundamentals/icons/edit-icon"
import BodyCard from "../../components/organisms/body-card"
import {
  useAdminUpdateShopCampaign,
  useGetShopCampaign,
} from "./affiliateHooks"
import Spinner from "../../components/atoms/spinner"
import XCircleIcon from "../../components/fundamentals/icons/x-circle-icon"
import { Button, IconButton } from "@medusajs/ui"
import useNotification from "../../hooks/use-notification"

export function ShopCampaign() {
  const [isEdit, setIsEdit] = useState(false)
  const [rate, setRate] = useState(-1)
  const notif = useNotification()
  const getShopCampaignQuery = useGetShopCampaign({
    onSuccess: (data) => {
      setRate(data.commissionRate)
    },
  })
  const updateShopCampaignMutation = useAdminUpdateShopCampaign({
    onError: (err) => {
      const error = err as Error
      const message = JSON.parse(error.message) as unknown as { error: string }
      notif("Error", message.error, "error")
    },
    onSuccess: () => {
      notif("Success", "Shop Campaign updated successfully", "success")
      getShopCampaignQuery.refetch()
      setIsEdit(false)
    },
  })

  const handleOpenEdit = () => {
    setIsEdit((prev) => !prev)
  }

  const handleCloseEdit = () => {
    setRate(getShopCampaignQuery.data?.commissionRate || 0)
    setIsEdit(false)
  }

  const handleEdit = () => {
    updateShopCampaignMutation.mutate({
      serial: getShopCampaignQuery.data?.serial || "",
      commissionRate: rate,
    })
  }

  return (
    <BodyCard
      forceDropdown={false}
      compact={true}
      title="Shop Campaign"
      subtitle="Shop Campaign allows you to set universal commission rate for all of your whole shop. Once setup, all of your products will be available for Affiliates to promote on Shopee channels or social media platforms. You only pay commission for successful orders."
      className="pb-large !h-fit"
    >
      {getShopCampaignQuery.isLoading ? (
        <div className="flex w-full items-center justify-center">
          <Spinner variant="secondary" />
        </div>
      ) : (
        <div className="grid grid-cols-12">
          <p className="col-span-3">Commission Rate</p>
          <div className="col-span-3 flex flex-row items-center gap-3">
            {isEdit ? (
              <>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    value={rate}
                    onChange={(e) => {
                      setRate(Number(e.target.value))
                    }}
                  />
                  <span>
                    {getShopCampaignQuery.data?.type === "PERCENTAGE"
                      ? "%"
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleEdit}
                    isLoading={updateShopCampaignMutation.isLoading}
                  >
                    Save
                  </Button>
                  <IconButton
                    onClick={
                      updateShopCampaignMutation.isLoading
                        ? undefined
                        : handleCloseEdit
                    }
                    size="small"
                  >
                    <XCircleIcon className="text-red-700" />
                  </IconButton>
                </div>
              </>
            ) : (
              <>
                <p>
                  {rate}
                  {getShopCampaignQuery.data?.type === "PERCENTAGE" ? "%" : ""}
                </p>
                <EditIcon
                  className="text-blue-70 cursor-pointer"
                  size="16px"
                  onClick={handleOpenEdit}
                />
              </>
            )}
          </div>
        </div>
      )}
    </BodyCard>
  )
}
