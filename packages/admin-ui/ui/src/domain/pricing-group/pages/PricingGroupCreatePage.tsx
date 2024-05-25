import { PricingGroupFormType } from "../pricingGroup/form/pricingGroupSchema"
import { useAdminCreateTargettedCampaign } from "../affiliateHooks"
import { useNavigate } from "react-router-dom"
import { PricingGroupForm } from "../pricingGroup/PricingGroupForm"

export function PricingGroupCreatePage() {
  const navigate = useNavigate()

  const createCampaignMachine = useAdminCreateTargettedCampaign({
    onSuccess: (data) => {
      navigate(`/a/affiliate/campaigns/${data.data.serial}`)
    },
  })

  // TODO: change this handler
  const handleSubmit = (data: PricingGroupFormType) => {
    console.log("data", data)
    // createCampaignMachine.mutate({
    //   name: data.name,
    //   started_at: data.startTime,
    //   ended_at: data.showEndTime && data.endTime ? data.endTime : null,
    //   user_target_type: "SPECIFIC",
    //   product_target_type: data.productTargetType,
    //   user_targets: data.customerIds,
    //   product_targets:
    //     data.productTargetType === "ALL"
    //       ? [
    //           {
    //             amount: data.productTargetSingleCommissionRate || 0,
    //             reference: "ALL",
    //             type: "PERCENTAGE",
    //           },
    //         ]
    //       : data.productTargets?.map((t) => ({
    //           amount: t.commisionRate,
    //           reference: t.productId,
    //           type: "PERCENTAGE",
    //         })) || [],
    // })
  }

  return (
    <PricingGroupForm
      onSubmit={handleSubmit}
      isLoadingSubmit={createCampaignMachine.isLoading}
    />
  )
}
