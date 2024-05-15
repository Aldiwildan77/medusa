import { useMemo } from "react"
import { Column } from "react-table"
import { FreeSample } from "../../../types/freeSample"
import CustomerAvatarItem from "../../../components/molecules/customer-avatar-item"
import { getColor } from "../../../utils/color"
import Tooltip from "../../../components/atoms/tooltip"
import dayjs from "dayjs"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"

export const useFreeSampleTableColumn = () => {
  const columns: Column<FreeSample>[] = useMemo(
    () => [
      {
        Header: "Serial",
        accessor: "serial",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Date created",
        accessor: "transaction_date",
        Cell: ({ cell: { value } }) => (
          <div>
            <Tooltip content={dayjs(value).format("DD MMM YYYY HH:mm")}>
              {dayjs(value).format("DD MMM YYYY")}
            </Tooltip>
          </div>
        ),
      },
      {
        Header: "Customerr",
        accessor: "customer",
        Cell: ({ row, cell: { value } }) => (
          <div>
            <CustomerAvatarItem
              customer={{
                first_name: value?.first_name,
                last_name: value?.last_name,
                email: value.email,
              }}
              color={getColor(row.index)}
            />
          </div>
        ),
      },
      {
        Header: "Product",
        accessor: "items",
        Cell: ({ row: { original } }) => {
          const product = original.items[0]

          return (
            <div className="flex items-center">
              <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
                {product.product_variant?.thumbnail ? (
                  <img
                    src={product.product_variant?.thumbnail}
                    className="rounded-soft h-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              {product?.product_variant?.title}
            </div>
          )
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => value,
      },
    ],
    []
  )

  return columns
}
