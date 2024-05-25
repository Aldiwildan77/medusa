import { ArrowLeftMini } from "@medusajs/icons"
import { useNavigate, useParams } from "react-router-dom"
import { useAdminCustomDelete, useAdminCustomQuery } from "medusa-react"
import { usePrompt, Button, Text, Container } from "@medusajs/ui"
import type { PricingGroup } from "../../../types/addOnDeal"
import { PricingGroupProductsTable } from "../pricing-groups/pricing-group-products-table"
import { Toaster } from "react-hot-toast"
import useNotification from "../../../hooks/use-notification"

export const AddOnDealDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dialog = usePrompt()
  const notif = useNotification()

  const { data, isLoading } = useAdminCustomQuery<{}, PricingGroup>(
    `/pricing-groups/${id}`,
    [],
    {},
    {
      refetchOnMount: "always",
      cacheTime: 0,
    }
  )

  const customDelete = useAdminCustomDelete<null>(`/pricing-groups/${id}`, [])

  const handleDeleteGroup = async () => {
    const confirmed = await dialog({
      title: `Delete ${data && data.name ? data.name : `pricing group ${id}`}`,
      description:
        "Confirm that you would like to delete the pricing group. Products currently associated with the pricing group will be disassociated.",
    })

    if (confirmed) {
      customDelete.mutate(undefined, {
        onSuccess: () => {
          notif(
            "Deleted Pricing Group",
            `The group '${
              data && data.name ? data.name : id
            }' was deleted successfully.`,
            "success"
          )
          navigate("/a/pricing-groups")
        },
        onError: (e) => {
          console.error("Error deleting pricing group", e?.message)
          notif("Error Deleting Pricing Group", e?.message, "error")
        },
      })
    }
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <Toaster />
      <Button size="small" variant="transparent">
        <div
          className="gap-x-xsmall text-grey-50 inter-grey-40 inter-small-semibold flex items-center"
          onClick={() => navigate("/a/pricing-groups")}
        >
          <ArrowLeftMini />
          <Text size="xsmall" weight="plus" as="span" className="ml-1">
            Back to Pricing Groups
          </Text>
        </div>
      </Button>
      <Container className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-grey-90 inter-xlarge-semibold">
            {isLoading || !data || !data.name
              ? `Pricing Group: ${id}`
              : data.name}
          </h1>
          <Button variant="danger" onClick={handleDeleteGroup}>
            Delete Group
          </Button>
        </div>
        <Text>
          Use the table below to search and add or remove products from the
          pricing group. Any products belonging to the same group will be used
          to calculate volume pricing.
        </Text>
        <Text className="mb-4">
          Products can belong to multiple pricing groups.
        </Text>
        {id && <PricingGroupProductsTable groupId={id} />}
      </Container>
    </div>
  )
}
