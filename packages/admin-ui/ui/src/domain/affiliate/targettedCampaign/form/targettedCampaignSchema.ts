import * as z from "zod"

export const targettedCampaignFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    startTime: z.string().min(1, {
      message: "Start time is required",
    }),
    showEndTime: z.boolean().optional(),
    endTime: z.string().optional(),
    customerIds: z.array(z.string()).min(1, {
      message: "At least one customer is required",
    }),
    productTargetType: z.enum(["ALL", "PRODUCT"], {
      required_error: "Please select a type",
    }),
    productTargetSingleCommissionRate: z.number().optional(),
    productTargets: z
      .array(
        z.object({
          productId: z.string(),
          productImage: z.string(),
          productName: z.string(),
          commisionRate: z
            .number()
            .min(1, { message: "Commision rate is required" }),
          type: z.enum(["PERCENTAGE"]),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.showEndTime && !data.endTime) {
        return false
      }
      return true
    },
    {
      message: "End time is required",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      if (
        data.productTargetType === "ALL" &&
        !data.productTargetSingleCommissionRate
      ) {
        return false
      }
      return true
    },
    {
      message: "Commission rate is required",
      path: ["productTargetSingleCommissionRate"],
    }
  )
  .refine(
    (data) => {
      if (
        data.productTargetType === "PRODUCT" &&
        (!data.productTargets || data.productTargets.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: "At least one product is required",
      path: ["productTargets"],
    }
  )

export type TargettedCampaignForm = z.infer<typeof targettedCampaignFormSchema>
