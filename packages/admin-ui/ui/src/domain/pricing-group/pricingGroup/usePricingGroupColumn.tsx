import { useMemo } from "react"
import { Column } from "react-table"
import { PricingGroupListData } from "../../../types/pricingGroup"
import { Button } from "@medusajs/ui"

type Params = {
  onDelete: (id: string) => void
}

export const usePricingGroupColumn = (params: Params) => {
  const columns: Column<PricingGroupListData>[] = useMemo(
    () => [
      {
        Header: "Add-on Deals Name",
        accessor: "name",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-col py-1">
              <p className="text-sm">{original.name}</p>
              <p className="text-gray-500">{original.id}</p>
            </div>
          )
        },
      },
      {
        Header: "Is Active?",
        accessor: "is_active",
        Cell: ({ cell: { value } }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Main Products",
        accessor: "highlighted_products",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-1">
                {original.highlighted_products.map((p) => (
                  <img
                    key={p.id}
                    className="h-10 w-10 rounded-md object-cover"
                    src={p.thumbnail}
                    alt=""
                  />
                  // <img key={p.id} src="" alt="" />
                ))}
              </div>
            </div>
          )
        },
      },
      {
        Header: "Action",
        accessor: "id",
        Cell: ({ cell: { value } }) => {
          return (
            <Button
              variant="danger"
              size="base"
              onClick={() => params.onDelete(value)}
            >
              Delete
            </Button>
          )
        },
      },
    ],
    []
  )

  return [columns] as const
}
