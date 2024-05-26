import { useMemo } from "react"
import { Column } from "react-table"
import { PricingGroupListData } from "../../../types/pricingGroup"
import { Button } from "@medusajs/ui"

type Params = {
  onDelete: ({ id, index }: { id: string; index: number }) => void
  indexDeleting?: number
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
        Cell: ({ cell: { value } }) => {
          return <p>{value ? "Yes" : "No"}</p>
        },
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
        Cell: ({ cell: { value }, row: { index } }) => {
          return (
            <Button
              variant="danger"
              size="base"
              onClick={(e) => {
                e.stopPropagation()
                params.onDelete({
                  id: value,
                  index,
                })
              }}
              isLoading={params.indexDeleting === index}
            >
              Delete
            </Button>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.indexDeleting]
  )

  return [columns] as const
}
