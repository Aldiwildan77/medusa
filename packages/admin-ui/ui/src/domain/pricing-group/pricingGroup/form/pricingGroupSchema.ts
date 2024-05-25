import * as z from "zod"

export const pricingGroupFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  limitPurchase: z.number().min(1, {
    message: "Limit purchase is required",
  }),
  // TODO: add status
  mainProducts: z
    .array(
      z.object({
        productId: z.string(),
        productImage: z.string(),
        productName: z.string(),
        productVariantId: z.string(),
        productVariantName: z.string(),
        originalPrice: z.number(),
        stock: z.number(),
      })
    )
    .min(1, { message: "At least one product is required" }),
  addOnProducts: z
    .array(
      z.object({
        productId: z.string(),
        productImage: z.string(),
        productName: z.string(),
        productVariantId: z.string(),
        productVariantName: z.string(),
        originalPrice: z.number(),
        discountedPrice: z.number().min(1, { message: "Price is required" }),
        maxQuantity: z.number().min(1, { message: "Max quantity is required" }),
        stock: z.number(),
      })
    )
    .min(1, { message: "At least one product is required" }),
})

export type PricingGroupFormType = z.infer<typeof pricingGroupFormSchema>
