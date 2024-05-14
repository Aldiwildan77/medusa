import { useMemo } from "react"
import { Column } from "react-table"
import { Affiliator } from "../../../types/affiliate"

type Params = {
  selectedAffiliatorCustomerId: string
  setSelectedAffiliatorCustomerId: (id: string) => void
}

export const useAffiliatorTableColumn = (params: Params) => {
  const columns: Column<Affiliator>[] = useMemo(
    () => [
      {
        Header: () => "",
        width: 50,
        accessor: "customer_id",
        Cell: ({ cell: { value } }) => {
          return (
            <input
              id="default-radio-1"
              type="radio"
              value=""
              name="default-radio"
              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
              checked={params.selectedAffiliatorCustomerId === value}
              onChange={() => params.setSelectedAffiliatorCustomerId(value)}
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
    [params]
  )

  return columns
}
