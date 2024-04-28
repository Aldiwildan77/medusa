import * as z from "zod"

export const targettedCampaignFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    startTime: z.string().min(1, {
      message: "Start time is required",
    }),
    showEndTime: z.boolean().optional(),
    endTime: z.string().optional(),
    customerIds: z.array(z.string()),
    productTargetType: z.enum(["ALL", "PRODUCT"]),
    productTargets: z.array(
      z.object({
        productId: z.string(),
        productImage: z.string(),
        productName: z.string(),
        commisionRate: z.number().min(1, { message: "Amount is required" }),
        type: z.enum(["PERCENTAGE"]),
      })
    ),
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

export type TargettedCampaignForm = z.infer<typeof targettedCampaignFormSchema>
