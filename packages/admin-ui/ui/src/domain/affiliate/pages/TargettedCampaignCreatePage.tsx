import { useForm } from "react-hook-form"
import { BasicInformation } from "../targettedCampaign/form/BasicInformation"
import { AffiliateUserTargetTable } from "../targettedCampaign/form/AffiliateUserTargetTable"

type Form = {
  name: string
  startTime: Date
  endTime: Date | null
}

export function TargettedCampaignCreatePage() {
  const {
    setValue,
    formState: { errors },
  } = useForm<Form>({})

  return (
    <div className="gap-y-xsmall flex h-full grow flex-col">
      <div className="flex flex-col gap-4">
        <BasicInformation />
        <AffiliateUserTargetTable />
      </div>
    </div>
  )
}
