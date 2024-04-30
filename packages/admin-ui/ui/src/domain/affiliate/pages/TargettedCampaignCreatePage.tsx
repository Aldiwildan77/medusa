import { TargettedCampaignFormType } from "../targettedCampaign/form/targettedCampaignSchema"
import { useAdminCreateTargettedCampaign } from "../affiliateHooks"
import { useNavigate } from "react-router-dom"
import { TargettedCampaignForm } from "../targettedCampaign/TargettedCampaignForm"

export function TargettedCampaignCreatePage() {
  const navigate = useNavigate()

  const createCampaignMachine = useAdminCreateTargettedCampaign({
    onSuccess: (data) => {
      navigate(`/a/affiliate/campaigns/${data.data.serial}`)
    },
  })

  const handleSubmit = (data: TargettedCampaignFormType) => {
    createCampaignMachine.mutate({
      name: data.name,
      started_at: data.startTime,
      ended_at: data.showEndTime && data.endTime ? data.endTime : null,
      user_target_type: "SPECIFIC",
      product_target_type: data.productTargetType,
      user_targets: data.customerIds,
      product_targets:
        data.productTargetType === "ALL"
          ? [
              {
                amount: data.productTargetSingleCommissionRate || 0,
                reference: "ALL",
                type: "PERCENTAGE",
              },
            ]
          : data.productTargets?.map((t) => ({
              amount: t.commisionRate,
              reference: t.productId,
              type: "PERCENTAGE",
            })) || [],
    })
  }

  return (
    <TargettedCampaignForm
      onSubmit={handleSubmit}
      isLoadingSubmit={createCampaignMachine.isLoading}
    />
  )
}
