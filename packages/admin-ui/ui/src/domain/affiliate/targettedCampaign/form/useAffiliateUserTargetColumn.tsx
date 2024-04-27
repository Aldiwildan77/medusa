import { useMemo } from "react"
import { Column } from "react-table"
import { Affiliator } from "../../../../types/affiliate"
// import { ColumnDef } from "@tanstack/react-table"

type Params = {
  selectedAffiliatorCustomerIds: string[]
  onSelectAffiliator: (checked: boolean, customerId: string) => void
  onSelectedAll: (checked: boolean, customerIds: string[]) => void
}

export const useTargettedCampaignColumn = (params: Params) => {
  const columns: Column<Affiliator>[] = useMemo(
    () => [
      {
        Header: ({ rows }) => {
          // check through all current rows if all are selected
          const isAllSelected = rows.every((row) =>
            params.selectedAffiliatorCustomerIds.includes(
              row.original.customer_id
            )
          )
          console.log("isAllSelected", isAllSelected)

          return (
            <input
              id="default-checkbox"
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => {
                params.onSelectedAll(
                  e.target.checked,
                  rows.map((row) => row.original.customer_id)
                )
              }}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
          )
        },
        width: 50,
        accessor: "customer_id",
        Cell: ({ cell: { value } }) => {
          return (
            <input
              id="default-checkbox"
              type="checkbox"
              checked={params.selectedAffiliatorCustomerIds.includes(value)}
              onChange={(e) => {
                params.onSelectAffiliator(e.target.checked, value)
              }}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
          )
        },
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Social media",
        accessor: "social_media",
        Cell: ({ row: { original } }) => {
          const renderSocialMedia = (socmed: Affiliator["social_media"][0]) => {
            switch (socmed.platform) {
              case "instagram":
                return (
                  <a
                    href={socmed.username}
                    className="cursor-pointer"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="/images/social-media/instagram.svg"
                      className="h-6 w-6"
                    />
                  </a>
                )

              case "tiktok":
                return (
                  <a href={socmed.username}>
                    <img
                      src="/images/social-media/tiktok.svg"
                      className="h-6 w-6"
                    />
                  </a>
                )
              default:
                return null
            }
          }
          return (
            <div className="flex flex-row gap-1">
              {original.social_media.map(renderSocialMedia)}
            </div>
          )
        },
      },
      {
        Header: "Total Products Sold",
        accessor: "total_product_affiliated",
        Cell: ({ cell: { value } }) => value,
      },
    ],
    [params.selectedAffiliatorCustomerIds]
  )

  return [columns] as const
}
