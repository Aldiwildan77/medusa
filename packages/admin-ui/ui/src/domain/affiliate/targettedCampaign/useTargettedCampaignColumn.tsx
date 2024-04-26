import { useMemo } from "react"
import StatusIndicator from "../../../components/fundamentals/status-indicator"
import { Column } from "react-table"
import { AffiliateGroups } from "../../../types/affiliate"
import dayjs from "dayjs"

export const useTargettedCampaignColumn = () => {
  const getProductStatus = (status: AffiliateGroups["status"]) => {
    switch (status) {
      case "DRAFT":
        return <StatusIndicator title="Draft" variant="default" />
      case "ACTIVE":
        return <StatusIndicator title="Active" variant="success" />
      case "ENDED":
        return <StatusIndicator title="Ended" variant="danger" />
      case "TERMINATED":
      default:
        return <StatusIndicator title="Terminated" variant="warning" />
    }
  }

  const columns: Column<AffiliateGroups>[] = useMemo(
    () => [
      {
        Header: "Campaign Name & ID",
        accessor: "serial",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-col py-1">
              <p className="text-sm">{original.name}</p>
              <p className="text-gray-500">{original.serial}</p>
            </div>
          )
        },
      },
      {
        Header: "Time",
        accessor: "started_at",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {dayjs(original.started_at).format("DD/MM/YYYY HH:mm")} -{" "}
              {original.ended_at
                ? dayjs(original.ended_at).format("DD/MM/YYYY HH:mm")
                : "No Limit"}
            </div>
          )
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => getProductStatus(value),
      },
      {
        Header: "Product(s)",
        accessor: "product_target_type",
        Cell: ({ row: { original } }) => {
          const isAllProducts = original.product_target_type === "ALL"
          const isEmpty = original.product_targets.length === 0

          if (isAllProducts) {
            return "All products"
          }

          if (isEmpty) {
            return "--"
          }

          return `${original.product_targets.length} Products`
        },
      },
      {
        Header: "Commision",
        accessor: "product_targets",
        Cell: ({ row: { original } }) => {
          const sortedProducts = original.product_targets
            // filter out amount that is same
            .filter((product, index, self) => {
              return (
                index === self.findIndex((t) => t.amount === product.amount)
              )
            })
            .sort(
              // sort by amount ascending
              (a, b) => a.amount - b.amount
            )
          const smallest = sortedProducts[0]

          if (sortedProducts.length === 1) {
            return `${smallest.amount}%`
          }

          const largest = sortedProducts[sortedProducts.length - 1]

          return (
            <div>
              {smallest.amount}% - {largest.amount}%
            </div>
          )
        },
      },
      {
        Header: "Affiliate Target",
        accessor: "user_targets",
        Cell: ({ row: { original } }) => {
          const isAllAffiliates = original.user_target_type === "ALL"

          if (isAllAffiliates) {
            return "All Affiliates"
          }

          const affiliateCount = original.user_targets.length
          return `${affiliateCount} Affiliates`
        },
      },
    ],
    []
  )

  return [columns] as const
}
