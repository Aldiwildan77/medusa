import { useMemo } from "react"
import { Column } from "react-table"
import { PricedProduct, PricedVariant } from "@medusajs/client-types"
import { TargettedCampaignFormType } from "../targettedCampaignSchema"
import { formatAmountWithSymbol } from "../../../../../utils/prices"

type Params = {
  selectedProducts: TargettedCampaignFormType["productTargets"]
  onSelectProduct: (
    checked: boolean,
    product: NonNullable<TargettedCampaignFormType["productTargets"]>[0]
  ) => void
  onSelectAll: (
    checked: boolean,
    products: NonNullable<TargettedCampaignFormType["productTargets"]>
  ) => void
}

export const useAffiliateProductTargetProductModalColumn = (params: Params) => {
  const columns: Column<PricedProduct>[] = useMemo(
    () => [
      {
        width: 50,
        accessor: "id",
        Header: ({ rows }) => {
          // check through all current rows if all are selected
          const isAllSelected = rows.every((row) =>
            params.selectedProducts?.some(
              (product) => product.productId === row.original.id
            )
          )

          return (
            <input
              id="default-checkbox"
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => {
                params.onSelectAll(
                  e.target.checked,
                  rows.map((row) => ({
                    productId: row.original.id,
                    productImage: row.original.thumbnail || "",
                    productName: row.original.title,
                    type: "PERCENTAGE",
                    commisionRate: 0,
                  }))
                )
              }}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
          )
        },
        Cell: ({ row: { original } }) => {
          return (
            <input
              id="default-checkbox"
              type="checkbox"
              checked={params.selectedProducts?.some(
                (product) => product.productId === original.id
              )}
              onChange={(e) => {
                params.onSelectProduct(e.target.checked, {
                  productId: original.id,
                  productImage: original.thumbnail || "",
                  productName: original.title,
                  type: "PERCENTAGE",
                  commisionRate: 0,
                })
              }}
              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
          )
        },
      },
      {
        Header: "Name",
        accessor: "title",
        width: 100,
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-row gap-2 p-2">
              {original.thumbnail && (
                <img src={original.thumbnail} className="h-10 w-10" />
              )}
              <div className="flex flex-col gap-0">
                <p className="text-[14px]">{original.title}</p>
                <p className="text-[12px] text-gray-500">{original.id}</p>
              </div>
            </div>
          )
        },
      },
      {
        Header: "Price(Rp)",
        accessor: "variants",
        width: 200,
        Cell: ({ row: { original } }) => {
          const prices = original.variants?.map((variant: PricedVariant) => {
            // get the price that doesn't have price_list_id (it means it's the default price)
            return variant.prices?.find((p) => !p.price_list_id)?.amount || 0
          })

          // from small to big
          const sortedPrices =
            prices
              ?.sort((a, b) => a - b)
              // clear out the duplicates
              .filter((price, index, self) => self.indexOf(price) === index) ||
            []

          const smallestPrice = formatAmountWithSymbol({
            amount: sortedPrices?.[0] || 0,
            currency: "IDR",
          })

          if (sortedPrices.length === 1) {
            return smallestPrice
          }

          const largestPrice = formatAmountWithSymbol({
            amount: sortedPrices[sortedPrices.length - 1],
            currency: "IDR",
          })

          return `${smallestPrice} - ${largestPrice}`
        },
      },
      {
        Header: "Stock",
        accessor: "handle",
        width: 100,
        Cell: ({ row: { original } }) => {
          const allStock =
            original.variants?.reduce(
              (acc, variant) => acc + variant.inventory_quantity,
              0
            ) || 0

          return allStock
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.selectedProducts]
  )

  return [columns] as const
}
