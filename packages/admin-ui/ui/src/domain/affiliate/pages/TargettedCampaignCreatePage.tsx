import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { BasicInformation } from "../targettedCampaign/form/BasicInformation"
import { AffiliateUserTargetTable } from "../targettedCampaign/form/AffiliateUserTargetTable"
import {
  TargettedCampaignForm,
  targettedCampaignFormSchema,
} from "../targettedCampaign/form/targettedCampaignSchema"
import { Button } from "@medusajs/ui"
import { AffiliateProductTarget } from "../targettedCampaign/form/AffiliateProductTarget"
import { useAdminCreateTargettedCampaign } from "../affiliateHooks"
import { useNavigate } from "react-router-dom"

export function TargettedCampaignCreatePage() {
  const navigate = useNavigate()
  const {
    setValue,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<TargettedCampaignForm>({
    resolver: zodResolver(targettedCampaignFormSchema),
    mode: "onChange",
  })

  const createCampaignMachine = useAdminCreateTargettedCampaign({
    onSuccess: (data) => {
      navigate(`/a/affiliate/campaigns/${data.data.serial}`)
    },
  })

  const values = watch()

  const handleSubmitForm = (data: TargettedCampaignForm) => {
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
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <div className="gap-y-xsmall flex h-full grow flex-col">
        <div className="flex flex-col gap-4">
          <BasicInformation
            errors={errors}
            setValue={setValue}
            values={values}
          />
          <AffiliateUserTargetTable
            errors={errors}
            setValue={setValue}
            values={values}
          />
          <AffiliateProductTarget
            errors={errors}
            setValue={setValue}
            values={values}
          />
          <Button
            className="ml-auto"
            variant="primary"
            type="submit"
            isLoading={createCampaignMachine.isLoading}
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  )
}
