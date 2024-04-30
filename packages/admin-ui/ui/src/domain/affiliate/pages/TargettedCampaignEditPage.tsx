import { TargettedCampaignFormType } from "../targettedCampaign/form/targettedCampaignSchema"
import {
  useAdminEditTargettedCampaign,
  useGetSingleTargettedCampaign,
} from "../affiliateHooks"
import { useNavigate, useParams } from "react-router-dom"
import { TargettedCampaignForm } from "../targettedCampaign/TargettedCampaignForm"
import { useAdminProducts } from "medusa-react"
import Spinner from "../../../components/atoms/spinner"
import { Product } from "@medusajs/client-types"

export function TargettedCampaignEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const getTargettedCampaign = useGetSingleTargettedCampaign(
    {
      serial: id || "",
    },
    {
      onSuccess: (data) => {
        if (!data.data) {
          navigate("/a/affiliate")
        }
      },
    }
  )

  const getProducts = useAdminProducts(
    {
      limit: getTargettedCampaign.data?.data?.product_targets?.length,
      offset: 0,
      id:
        getTargettedCampaign.data?.data?.product_targets?.map(
          (t) => t.reference
        ) || [],
    },
    {
      enabled: !!getTargettedCampaign.data,
    }
  )

  const editCampaignMachine = useAdminEditTargettedCampaign({
    onSuccess: () => {
      getTargettedCampaign.refetch()
    },
  })

  const isLoading = getTargettedCampaign.isFetching || getProducts.isLoading

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  if (!getTargettedCampaign.data || !getProducts?.products) {
    return null
  }

  const handleSubmit = (data: TargettedCampaignFormType) => {
    console.log("data", data)
    editCampaignMachine.mutate({
      serial: getTargettedCampaign.data.data.serial,
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

  const campaign = getTargettedCampaign.data?.data

  const productMap = getProducts.products?.reduce((acc, p) => {
    const id = p.id
    if (id) {
      acc[id] = p as unknown as Product
    }
    return acc
  }, {} as Record<string, Product>)

  return (
    <TargettedCampaignForm
      onSubmit={handleSubmit}
      isLoadingSubmit={editCampaignMachine.isLoading}
      defaultValues={{
        customerIds: campaign.user_targets,
        name: campaign.name,
        startTime: campaign.started_at,
        endTime: campaign.ended_at || undefined,
        productTargetType: campaign.product_target_type,
        showEndTime: !!campaign.ended_at,
        productTargetSingleCommissionRate:
          campaign.product_target_type === "ALL"
            ? campaign.product_targets?.[0]?.amount
            : undefined,
        productTargets: campaign.product_targets?.map((t) => {
          const product = productMap?.[t.reference] as Product

          return {
            productId: t.reference,
            commisionRate: t.amount,
            type: t.type,
            productImage: product?.thumbnail || "",
            productName: product?.title || "",
          }
        }),
      }}
    />
  )
}
