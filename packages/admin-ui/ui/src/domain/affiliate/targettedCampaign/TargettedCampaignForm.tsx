import { useForm } from "react-hook-form"
import { BasicInformation } from "../targettedCampaign/form/BasicInformation"
import { AffiliateUserTargetTable } from "../targettedCampaign/form/AffiliateUserTargetTable"
import { Button } from "@medusajs/ui"
import { AffiliateProductTarget } from "../targettedCampaign/form/AffiliateProductTarget"
import {
  TargettedCampaignFormType as Form,
  targettedCampaignFormSchema,
} from "./form/targettedCampaignSchema"
import { zodResolver } from "@hookform/resolvers/zod"

type Props = {
  onSubmit: (data: Form) => void
  isLoadingSubmit: boolean
  defaultValues?: Form
}

export function TargettedCampaignForm(props: Props) {
  const {
    setValue,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<Form>({
    resolver: zodResolver(targettedCampaignFormSchema),
    mode: "onChange",
    defaultValues: props.defaultValues,
  })

  const values = watch()

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
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
            isLoading={props.isLoadingSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  )
}
