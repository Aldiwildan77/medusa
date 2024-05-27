import { PricingGroupFormType } from "../pricingGroup/form/pricingGroupSchema"
import {
  useDeleteProductPricingGroup,
  useGetPricingGroup,
  useUpdatePricingGroup,
  useUpsertProductPricingGroup,
} from "../pricingGroupHooks"
import { useParams } from "react-router-dom"
import { PricingGroupForm } from "../pricingGroup/PricingGroupForm"
import Spinner from "../../../components/atoms/spinner"
import { useMemo, useState } from "react"

export function PricingGroupEditPage() {
  const { id } = useParams()
  const pricingGroupId = id || ""
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isFetching, data, refetch } = useGetPricingGroup(
    {
      id: pricingGroupId,
    },
    {
      enabled: !!pricingGroupId,
    }
  )
  const updatePricingGroup = useUpdatePricingGroup()
  const upsertProductPricingGroup = useUpsertProductPricingGroup()
  const deleteProductPricingGroup = useDeleteProductPricingGroup()

  const handleSubmit = async (data: PricingGroupFormType) => {
    // 1. update pricing group
    // 2. filter out deleted product that exist in mainProducts / addOnProducts
    // 3. upsert product that exist in mainProducts / addOnProducts
    // 4. refetch

    setIsSubmitting(true)
    const updatePricingGroupPromise = await updatePricingGroup.mutateAsync({
      id: pricingGroupId,
      body: {
        name: data.name,
        limit_purchase_quantity: data.limitPurchase,
        is_active: data.isActive,
      },
    })
    const deletedMainProducts =
      data.deletedProducts?.filter((product) => {
        const isExistInMainProducts = data.mainProducts.some(
          (mainProduct) => mainProduct.productId === product.productId
        )
        const isExistInAddOnProducts = data.addOnProducts.some(
          (addOnProduct) => addOnProduct.productId === product.productId
        )

        return !isExistInMainProducts && !isExistInAddOnProducts
      }) || []

    const deleteProductPromise =
      deletedMainProducts.length > 0
        ? await deleteProductPricingGroup.mutateAsync({
            group_id: pricingGroupId,
            products: deletedMainProducts.map((product) => ({
              product_id: product.productId,
              product_variant_id: product.productVariantId,
            })),
          })
        : null

    const upsertProductPromise = await upsertProductPricingGroup.mutateAsync({
      group_id: pricingGroupId,
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

    try {
      await Promise.all([
        updatePricingGroupPromise,
        deleteProductPromise,
        upsertProductPromise,
      ])
      refetch()
    } catch (error) {
      console.error("[submit] error: ", error)
    }
    setIsSubmitting(false)
  }

  const mainProducts: PricingGroupFormType["mainProducts"] = useMemo(() => {
    if (!data) {
      return []
    }

    return data.products.reduce((acc, p) => {
      p.variants.forEach((v) => {
        if (v.is_main) {
          acc.push({
            productId: p.id,
            productVariantId: v.id,
            originalPrice: v.price.original,
            productName: p.title,
            productVariantName: v.title,
            stock: v.stock,
            productImage: p.thumbnail,
          })
        }
      })

      return acc
    }, [] as PricingGroupFormType["mainProducts"])
  }, [data])

  const addOnProducts: PricingGroupFormType["addOnProducts"] = useMemo(() => {
    if (!data) {
      return []
    }

    return data.products.reduce((acc, p) => {
      p.variants.forEach((v) => {
        if (!v.is_main) {
          acc.push({
            productId: p.id,
            productVariantId: v.id,
            originalPrice: v.price.original,
            productName: p.title,
            productVariantName: v.title,
            discountedPrice: v.price.current,
            maxQuantity: v.max_quantity,
            stock: v.stock,
            productImage: p.thumbnail,
          })
        }
      })

      return acc
    }, [] as PricingGroupFormType["addOnProducts"])
  }, [data])

  if (isFetching || !data) {
    return (
      <div className="flex w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <PricingGroupForm
      onSubmit={handleSubmit}
      isLoadingSubmit={isSubmitting}
      defaultValues={{
        name: data.name,
        limitPurchase: data.limit_purchase_quantity,
        isActive: data.is_active,
        mainProducts: mainProducts,
        addOnProducts: addOnProducts,
      }}
    />
  )
}
