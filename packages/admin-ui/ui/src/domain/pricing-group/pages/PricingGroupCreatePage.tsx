import { PricingGroupFormType } from "../pricingGroup/form/pricingGroupSchema"
import { useCreatePricingGroup } from "../pricingGroupHooks"
import { useNavigate } from "react-router-dom"
import { PricingGroupForm } from "../pricingGroup/PricingGroupForm"

export function PricingGroupCreatePage() {
  const navigate = useNavigate()

  const createMachine = useCreatePricingGroup({
    onSuccess: (data) => {
      navigate(`/a/pricing-group/${data.id}`)
    },
  })

  const handleSubmit = (data: PricingGroupFormType) => {
    createMachine.mutate({
      name: data.name,
      limit_purchase_quantity: data.limitPurchase,
      is_active: data.isActive,
      products: [
        ...data.mainProducts.map((product) => ({
          product_id: product.productId,
          product_variant_id: product.productVariantId,
          price: 0,
          max_quantity: 0,
          is_main: true,
        })),
        ...data.addOnProducts.map((product) => ({
          product_id: product.productId,
          product_variant_id: product.productVariantId,
          price: product.discountedPrice,
          max_quantity: product.maxQuantity,
          is_main: false,
        })),
      ],
    })
  }

  return (
    <PricingGroupForm
      onSubmit={handleSubmit}
      isLoadingSubmit={createMachine.isLoading}
    />
  )
}
