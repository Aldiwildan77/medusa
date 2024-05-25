import { useForm } from "react-hook-form"
import { BasicInformation } from "./form/BasicInformation"
import { Button } from "@medusajs/ui"
import {
  PricingGroupFormType as Form,
  pricingGroupFormSchema,
} from "./form/pricingGroupSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { MainProductTable } from "./form/MainProductTable"
import { AddOnProductTable } from "./form/AddOnProductTable"

type Props = {
  onSubmit: (data: Form) => void
  isLoadingSubmit: boolean
  defaultValues?: Form
}

export function PricingGroupForm(props: Props) {
  const {
    setValue,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<Form>({
    resolver: zodResolver(pricingGroupFormSchema),
    mode: "onChange",
    defaultValues: props.defaultValues,
  })

  const values = watch()

  console.log("values", values)

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <div className="gap-y-xsmall flex h-full grow flex-col">
        <div className="flex flex-col gap-4">
          <BasicInformation
            errors={errors}
            setValue={setValue}
            values={values}
          />
          <MainProductTable
            errors={errors}
            setValue={setValue}
            values={values}
          />
          <AddOnProductTable
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
