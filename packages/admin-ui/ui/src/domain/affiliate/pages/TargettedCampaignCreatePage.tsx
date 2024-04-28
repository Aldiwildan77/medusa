import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { BasicInformation } from "../targettedCampaign/form/BasicInformation"
import { AffiliateUserTargetTable } from "../targettedCampaign/form/AffiliateUserTargetTable"
import {
  TargettedCampaignForm,
  targettedCampaignFormSchema,
} from "../targettedCampaign/form/targettedCampaignSchema"
import { Button } from "@medusajs/ui"

export function TargettedCampaignCreatePage() {
  const {
    setValue,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<TargettedCampaignForm>({
    resolver: zodResolver(targettedCampaignFormSchema),
  })

  const values = watch()

  const handleSubmitForm = (data: TargettedCampaignForm) => {
    console.log(data)
  }

  console.log("errors", errors)

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
          <Button
            className="float-right"
            variant="primary"
            size="small"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  )
}
